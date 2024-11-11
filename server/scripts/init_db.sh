#!/usr/bin/env bash

# Create local PostgreSQL database instance using Docker

# set -x
set -eo pipefail 

if ! [ -x "$(command -v docker)" ]; then
    echo >&2 "error: docker is not installed"
    exit 1
fi

TOML_FILE="${PWD}/config/local.toml"

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
    --publish "${DB_PORT}":5432 \
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

CREATE_QUERY="CREATE USER ${PGUSER} WITH PASSWORD '${PGPASSWORD}';"
docker exec -it "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -c "${CREATE_QUERY}" > /dev/null

echo "postgres is up on ${PGHOST}:5432 - ready for connections..."

CREATE_DB_QUERY="CREATE DATABASE ${PGDATABASE};"
docker exec -it "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -c "${CREATE_DB_QUERY}" > /dev/null

GRANT_SCHEMA_QUERY="GRANT ALL PRIVILEGES ON SCHEMA public TO ${PGUSER};"
docker exec -it "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -d "${PGDATABASE}" -c "${GRANT_SCHEMA_QUERY}" > /dev/null

echo "database '${PGDATABASE}' created successfully - inserting tables..."

docker exec -it "${CONTAINER_NAME}" psql -h "${PGHOST}" -U "${PGUSER}" -d "${PGDATABASE}" -f "./scripts/schema.sql" > /dev/null
echo "tables inserted successfully for database: '${PGDATABASE}'"

read -p "do you want to seed test data? (y/n): " SEED_DATA

if [[ "$SEED_DATA" == "yes" || "$SEED_DATA" == "y" ]]; then
    echo "seeding users..."

    NUM_ADMINS_EXPECTED=1
    NUM_STUDENTS_EXPECTED=3
    NUM_INSTRUCTORS_EXPECTED=3

    NUM_ADMINS_ACTUAL=0
    NUM_STUDENTS_ACTUAL=0
    NUM_INSTRUCTORS_ACTUAL=0

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

        random_number=$((RANDOM % 900 + 100))
        echo "${first_name}" | tr '[:upper:]' '[:lower:]' | sed "s/\$/${random_number}/"
    }

    for i in $(seq 1 $NUM_ADMINS_EXPECTED); do
            details=($(generate_details))
            first_name=${details[0]}
            last_name=${details[1]}
            username=${details[2]}

            INSERT_QUERY="
                INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number, office)
                VALUES ('$username', '$first_name', '$last_name', '${PASSWORD_HASH}', 'ADMIN', '555-555-5555', 'Admin Office')
                ON CONFLICT (username) DO NOTHING;" 2>&1

            result=$(docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}")

            if [[ $result == *"INSERT 1"* ]]; then
                let NUM_ADMINS_ACTUAL+=1
            else
                echo >&2 "duplicate username found: $username. Skipping..." > /dev/null
                let NUM_ADMINS_ACTUAL+=1
            fi   
    done

    for i in $(seq 1 $NUM_STUDENTS_EXPECTED); do
            details=($(generate_details))
            first_name=${details[0]}
            last_name=${details[1]}
            username=${details[2]}

            INSERT_QUERY="
                INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number)
                VALUES ('$username', '$first_name', '$last_name', '${PASSWORD_HASH}', 'STUDENT', '555-555-5555')
                ON CONFLICT (username) DO NOTHING;" 2>&1

            result=$(docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}")

            if [[ $result == *"INSERT 1"* ]]; then
                let NUM_STUDENTS_ACTUAL+=1
            else
                echo >&2 "duplicate username found: $username. Skipping..." > /dev/null
                let NUM_STUDENTS_ACTUAL+=1
            fi   
    done

    for i in $(seq 1 $NUM_INSTRUCTORS_EXPECTED); do
            details=($(generate_details))
            first_name=${details[0]}
            last_name=${details[1]}
            username=${details[2]}

            INSERT_QUERY="
                INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number, office)
                VALUES ('$username', '$first_name', '$last_name', '${PASSWORD_HASH}', 'INSTRUCTOR', '555-555-5555', 'Instructor Office')
                ON CONFLICT (username) DO NOTHING;" 2>&1

            result=$(docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}")

            if [[ $result == *"INSERT 1"* ]]; then
                let NUM_INSTRUCTORS_ACTUAL+=1
            else
                echo >&2 "duplicate username found: $username. Skipping..." > /dev/null
                let NUM_INSTRUCTORS_ACTUAL+=1
            fi   
    done

    echo ">> seeded $NUM_ADMINS_ACTUAL admins"
    echo ">> seeded $NUM_STUDENTS_ACTUAL students"
    echo ">> seeded $NUM_INSTRUCTORS_ACTUAL instructors"

    echo "seeding majors, courses, and major courses..."

    majors=("Computer Science" "Psychology" "Business Administration")
    disciplines=("CSC" "PSY" "BA")

    for i in ${!majors[@]}; do
        major_name="${majors[$i]}"
        discipline="${disciplines[$i]}"

        # Insert major into the major table
        INSERT_QUERY="
            INSERT INTO major (name, description)
            VALUES ('$major_name', 'Description for $major_name')
            ON CONFLICT (name) DO NOTHING;" 2>&1

        docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}" > /dev/null

        # Insert 5 courses for each major
        for j in $(seq 1 5); do
            course_number=$((100 + j))
            
            # Insert course into the course table
            INSERT_QUERY="
                INSERT INTO course (discipline, course_number, description, max_capacity)
                VALUES ('$discipline', '$course_number', 'Description for $discipline $course_number', 30)
                ON CONFLICT (discipline, course_number) DO NOTHING;" 2>&1

            docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}" > /dev/null

            # Insert into major_courses table, establishing the relationship
            INSERT_QUERY="
                INSERT INTO major_courses (major_name, course_discipline, course_number)
                VALUES ('$major_name', '$discipline', '$course_number')
                ON CONFLICT (major_name, course_discipline, course_number) DO NOTHING;" 2>&1

            docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}" > /dev/null
        done
    done

    echo ">> seeded majors, courses, and major courses"

    echo "assigning instructors to majors..."

    for i in $(seq 1 $NUM_INSTRUCTORS_ACTUAL); do
        username=$(docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -t -c "SELECT username FROM users WHERE role='INSTRUCTOR' LIMIT 1 OFFSET $((i - 1));" | xargs)

        username=$(echo "$username" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

        major_name=$(docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -t -c "SELECT name FROM major ORDER BY RANDOM() LIMIT 1;" | xargs)

        major_name=$(echo "$major_name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

        INSERT_QUERY="INSERT INTO user_majors (username, major_name) VALUES ('$username', '$major_name') ON CONFLICT (username, major_name) DO NOTHING;"

        docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}" > /dev/null
    done

    echo ">> assigned instructors to majors"
else
    echo "skipping test data seeding"
fi
