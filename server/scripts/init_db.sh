#!/usr/bin/env bash

# set -x
set -eo pipefail 

if ! [ -x "$(command -v docker)" ]; then
    echo >&2 "error: docker is not installed"
    exit 1
fi

TOML_FILE="${PWD}/config/development.toml"

if [ ! -f "$TOML_FILE" ]; then
    echo >&2 "config file not found: $TOML_FILE"
    exit 1
fi

# Function to extract value from TOML config
get_toml_value() {
    local key="$1"

    local line=$(grep -E "^\s*${key}\s*=" "$TOML_FILE")

    if [[ -z "$line" ]]; then
        echo >&2 "key '$key' not found in $TOML_FILE"
        return 1
    fi

    local value=$(echo "$line" | cut -d '=' -f 2 | tr -d ' "')

    echo "$value"
}

PGUSER=$(get_toml_value "PGUSER")
PGPASSWORD=$(get_toml_value "PGPASSWORD")
PGDATABASE=$(get_toml_value "PGDATABASE")
PGDHOST=$(get_toml_value "PGHOST")

SUPERUSER=postgres
SUPERUSER_PWD=password

# Fixed container name
CONTAINER_NAME="rb-db"

RUNNING_POSTGRES_CONTAINER=$(docker ps --filter 'name=rb-db' --format '{{.ID}}')

# If a Postgres container is running, output instructions to kill it and exit
if [[ -n $RUNNING_POSTGRES_CONTAINER ]]; then
    echo >&2 "Postgres container already running, kill it with"
    echo >&2 "    docker kill ${RUNNING_POSTGRES_CONTAINER}"
    exit 1
fi

docker run \
    --volume "./scripts/:/scripts/" \
    --env POSTGRES_USER=${SUPERUSER} \
    --env POSTGRES_PASSWORD=${SUPERUSER_PWD} \
    --health-cmd="pg_isready -U ${SUPERUSER} || exit 1" \
    --health-interval=1s \
    --health-timeout=5s \
    --health-retries=5 \
    --publish 5432:5432 \
    --detach \
    --name "${CONTAINER_NAME}" \
    postgres:alpine -N 1000 > /dev/null

until [ \
    "$(docker inspect -f "{{.State.Health.Status}}" ${CONTAINER_NAME})" == \
    "healthy" \
]; do     
    >&2 echo "Postgres is still unavailable - sleeping..."
    sleep 1 
done

CREATE_QUERY="CREATE USER ${PGUSER} WITH ENCRYPTED PASSWORD '${PGPASSWORD}';"
docker exec "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -c "${CREATE_QUERY}"

echo "postgres is up on ${PGHOST}:5432 - ready for connections..."

CREATE_DB_QUERY="CREATE DATABASE ${PGDATABASE};"
docker exec "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -c "${CREATE_DB_QUERY}"

GRANT_SCHEMA_QUERY="GRANT ALL PRIVILEGES ON SCHEMA public TO ${PGUSER};"
docker exec "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -d "${PGDATABASE}" -c "${GRANT_SCHEMA_QUERY}"

GRANT_CREATE_PRIVILEGES_QUERY="GRANT CREATE ON DATABASE ${PGDATABASE} TO ${PGUSER};"
docker exec "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -d "${PGDATABASE}" -c "${GRANT_CREATE_PRIVILEGES_QUERY}"

echo "database '${PGDATABASE}' created successfully - inserting tables..."

docker exec "${CONTAINER_NAME}" psql -h "${PGHOST}" -U "${PGUSER}" -d "${PGDATABASE}" -f "./scripts/schema.sql"
echo "tables inserted successfully for database: '${PGDATABASE}'"

read -p "do you want to seed test data? (y/n): " SEED_DATA

if [[ "$SEED_DATA" == "yes" || "$SEED_DATA" == "y" ]]; then
    echo "seeding users..."

    NUM_ADMINS_EXPECTED=1
    NUM_STUDENTS_EXPECTED=3
    NUM_TEACHERS_EXPECTED=3

    NUM_ADMINS_ACTUAL=0
    NUM_STUDENTS_ACTUAL=0
    NUM_TEACHERS_ACTUAL=0

    # Fixed password hash for all users (password123)
    PASSWORD_HASH='$argon2id$v=19$m=65536,t=3,p=1$5/JDguSRQqYWps2/V1ruJA$X33IbsiipHnq+8nqj14aXMx0qUNXGfjiVBPV6dgFE+U'

    generate_details() {
        line_count=$(wc -l < ./scripts/names.txt)

        random_line=$((RANDOM % line_count + 1))

        first_name=$(awk "NR==$random_line {print; exit}" ./scripts/names.txt | sed -e 's/[^a-zA-Z]//g')
        
        random_line=$((RANDOM % line_count + 1))
        last_name=$(awk "NR==$random_line {print; exit}" ./scripts/names.txt | sed -e 's/[^a-zA-Z]//g')

        echo "${first_name}"
        echo "${last_name}"

        # Username
        random_number=$((RANDOM % 900 + 100))
        echo "${first_name}" | tr '[:upper:]' '[:lower:]' | sed "s/\$/${random_number}/"
    }

    for i in $(seq 1 $NUM_ADMINS_EXPECTED); do
        details=($(generate_details))
        first_name=${details[0]}
        last_name=${details[1]}
        username=${details[2]}

        INSERT_QUERY="
            INSERT INTO users (first_name, last_name, username, password_hash, role, phone_number, office)
            VALUES ('$first_name', '$last_name', '$username', '${PASSWORD_HASH}', 'ADMIN', '555-555-5555', 'Admin Office')
            ON CONFLICT (username) DO NOTHING;" 2>&1

        result=$(docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}")

        let NUM_ADMINS_ACTUAL+=1
    done

    for i in $(seq 1 $NUM_STUDENTS_EXPECTED); do
        details=($(generate_details))
        first_name=${details[0]}
        last_name=${details[1]}
        username=${details[2]}

        INSERT_QUERY="
            INSERT INTO users (first_name, last_name, username, password_hash, role, phone_number)
            VALUES ('$first_name', '$last_name', '$username', '${PASSWORD_HASH}', 'STUDENT', '555-555-5555')
            ON CONFLICT (username) DO NOTHING;" 2>&1

        result=$(docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}")

        let NUM_STUDENTS_ACTUAL+=1
    done

    for i in $(seq 1 $NUM_TEACHERS_EXPECTED); do
        details=($(generate_details))
        first_name=${details[0]}
        last_name=${details[1]}
        username=${details[2]}

        INSERT_QUERY="
            INSERT INTO users (first_name, last_name, username, password_hash, role, phone_number, office)
            VALUES ('$first_name', '$last_name', '$username', '${PASSWORD_HASH}', 'TEACHER', '555-555-5555', 'Teacher Office')
            ON CONFLICT (username) DO NOTHING;" 2>&1

        result=$(docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}")

        let NUM_TEACHERS_ACTUAL+=1
    done

    echo ">> seeded $NUM_ADMINS_ACTUAL admins"
    echo ">> seeded $NUM_STUDENTS_ACTUAL students"
    echo ">> seeded $NUM_TEACHERS_ACTUAL teachers"

    echo "seeding majors..."

    majors=("Computer Science" "Computer Information Systems" "Business Administration")
    descriptions=(
        "Computer Science is the study of computational systems, programming languages, algorithms, and software development. It prepares students to design, develop, and implement software solutions."
        "Computer Information Systems focuses on the application of technology to solve business problems. It bridges the gap between business and IT, covering areas like systems analysis, database management, and IT project management."
        "Business Administration is a broad field that teaches students the fundamentals of managing and overseeing business operations. It includes areas like accounting, marketing, human resources, and operations management."
    )

    for i in ${!majors[@]}; do
        major_name="${majors[$i]}"
        major_description="${descriptions[$i]}"

        INSERT_QUERY="
            INSERT INTO majors (name, description)
            VALUES ('$major_name', '$major_description')
            ON CONFLICT (name) DO NOTHING;"

        docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}"

    done

    echo ">> successfully seeded majors"

    echo "seeding courses..."

    disciplines=("CSC" "CIS" "BA")

    course_descriptions=(
        "Introduction to programming, focusing on algorithms, data structures, and problem-solving techniques."
        "Focuses on the analysis, design, and implementation of business information systems to support organizational needs."
        "Covers the fundamentals of business management including operations, strategy, and entrepreneurship."
    )

    teacher_ids=($(docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -t -c "SELECT id FROM users WHERE role = 'TEACHER';"))

    for i in ${!disciplines[@]}; do
        discipline="${disciplines[$i]}"
        description="${course_descriptions[$i]}"

        teacher_id="${teacher_ids[$i % ${#teacher_ids[@]}]}"

        teacher_id=$(echo "$teacher_id" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

        for course_number in $(seq 100 110); do
            INSERT_QUERY="
                INSERT INTO courses (teacher_id, course_discipline, course_number, description)
                VALUES ('$teacher_id', '$discipline', $course_number, '$description')
                ON CONFLICT (course_discipline, course_number) DO NOTHING;"

            docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "$INSERT_QUERY"
        done
    done

    echo ">> successfully seeded courses"
        
    echo "seeding major_courses..."

    major_info=$(docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -t -c "SELECT id, name FROM majors;")

    echo "$major_info" | while read -r major_id major_name; do
        # Remove leading or trailing spaces
        major_id=$(echo "$major_id" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        major_name=$(echo "$major_name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//;s/^|*//;s/|*$//')

        if [ -z "$major_id" ] || [ -z "$major_name" ]; then
            continue
        fi

        # Remove leading or trailing spaces
        major_name=$(echo "$major_name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

        case "$major_name" in
            "Computer Science")
                discipline="CSC"
                ;;
            "Computer Information Systems")
                discipline="CIS"
                ;;
            "Business Administration")
                discipline="BA"
                ;;
        esac

        course_ids=$(docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -t -c "SELECT id FROM courses WHERE course_discipline = '$discipline';")

        for course_id in $course_ids; do
            # Remove leading or trailing spaces
            course_id=$(echo "$course_id" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

            if [ -n "$course_id" ]; then
                INSERT_QUERY="
                    INSERT INTO major_courses (major_id, course_id)
                    VALUES ('$major_id', '$course_id')
                    ON CONFLICT (major_id, course_id) DO NOTHING;"

                docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "$INSERT_QUERY"
            else
                echo "error: skipping empty course_id"
            fi
        done
    done

    echo ">> successfully seeded major_courses"

    echo "assigning students to majors..."
 
    student_ids=$(docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -t -c "SELECT id FROM users WHERE role = 'STUDENT';")
 
    major_ids=$(docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -t -c "SELECT id FROM majors;")
 
    student_array=($student_ids)
    major_array=($major_ids)
 
    for i in $(seq 0 $((${#student_array[@]} - 1))); do
        student_id="${student_array[$i]}"
        major_id="${major_array[$i]}"
 
        # Remove leading or trailing spaces
        student_id=$(echo "$student_id" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
 
        # Remove leading or trailing spaces
        major_id=$(echo "$major_id" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
 
        INSERT_QUERY="
            INSERT INTO user_majors (student_id, major_id)
            VALUES ('$student_id', '$major_id');"
 
        docker exec ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "$INSERT_QUERY"
    done
 
    echo ">> successfully assigned students to majors"

else
    echo "skipping test data seeding"
fi
