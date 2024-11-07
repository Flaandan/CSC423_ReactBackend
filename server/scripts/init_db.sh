#!/usr/bin/env bash

# TODO: update to seed data using relational tables (major_courses, user_majors, registration)

# set -x
set -eo pipefail 

if ! [ -x "$(command -v docker)" ]; then
    echo >&2 "error: docker is not installed"
    exit 1
fi

# When changing PGUSER, PGPASSWORD, PGDATABASE, or PGHOST, make sure to
# update the `config/local.toml` to reflect the changes

PGUSER=admin
PGPASSWORD=password
PGDATABASE=react_backend
PGHOST=127.0.0.1

SUPERUSER=postgres
SUPERUSER_PWD=password

CONTAINER_NAME="rb-db"

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
    postgres:alpine -N 1000 \
    > /dev/null

until [ "$(docker inspect -f "{{.State.Health.Status}}" ${CONTAINER_NAME})" == "healthy" ]; do     
    >&2 echo "postgres is still unavailable - sleeping..."
    sleep 1 
done

echo "postgres is up on ${PGHOST}:5432 - ready for connections"

CREATE_QUERY="CREATE USER ${PGUSER} WITH PASSWORD '${PGPASSWORD}';"
docker exec -it "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -c "${CREATE_QUERY}" > /dev/null

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

    NUM_ADMINS_EXPECTED=2
    NUM_STUDENTS_EXPECTED=5
    NUM_INSTRUCTORS_EXPECTED=5

    NUM_ADMINS_ACTUAL=0
    NUM_STUDENTS_ACTUAL=0
    NUM_INSTRUCTORS_ACTUAL=0

    NUM_MAJORS=10
    NUM_COURSES=50

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

    echo "seeding majors..."

    for i in $(seq 1 $NUM_MAJORS); do
        case $i in
            1) major_name="Computer Science"; major_description="The study of computers and computational systems." ;;
            2) major_name="Mechanical Engineering"; major_description="The design, analysis, and manufacturing of mechanical systems." ;;
            3) major_name="Biology"; major_description="The study of living organisms and their interactions with the environment." ;;
            4) major_name="Electrical Engineering"; major_description="The study of electrical systems and electronic devices." ;;
            5) major_name="Psychology"; major_description="The study of behavior and mental processes." ;;
            6) major_name="Business Administration"; major_description="The study of business operations, management, and leadership." ;;
            7) major_name="Physics"; major_description="The study of matter, energy, and the fundamental forces of nature." ;;
            8) major_name="Chemistry"; major_description="The study of substances, their properties, and chemical reactions." ;;
            9) major_name="Mathematics"; major_description="The abstract study of numbers, quantities, and shapes." ;;
            10) major_name="Law"; major_description="The study of legal systems, laws, and their application." ;;
            *) major_name="Undecided"; major_description="Exploring various fields to choose a major." ;;
        esac

        INSERT_QUERY="
            INSERT INTO major (name, description)
            VALUES ('$major_name', '$major_description')
            ON CONFLICT (name) DO NOTHING;" 2>&1

        docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}" > /dev/null
    done

    >&2 echo ">> seeded $NUM_MAJORS majors"

    echo "Seeding courses..."

    for i in $(seq 1 $NUM_COURSES); do
        case $i in
            1) discipline="CSC"; course_number=101; course_description="Introduction to Computer Science."; max_capacity=50 ;;
            2) discipline="CSC"; course_number=102; course_description="Data Structures and Algorithms."; max_capacity=60 ;;
            3) discipline="ME"; course_number=201; course_description="Statics and Dynamics."; max_capacity=40 ;;
            4) discipline="ME"; course_number=202; course_description="Thermodynamics."; max_capacity=45 ;;
            5) discipline="BIO"; course_number=101; course_description="General Biology I."; max_capacity=80 ;;
            6) discipline="BIO"; course_number=102; course_description="General Biology II."; max_capacity=75 ;;
            7) discipline="EE"; course_number=101; course_description="Circuit Analysis."; max_capacity=50 ;;
            8) discipline="EE"; course_number=102; course_description="Digital Systems Design."; max_capacity=45 ;;
            9) discipline="PSY"; course_number=101; course_description="Introduction to Psychology."; max_capacity=90 ;;
            10) discipline="PSY"; course_number=102; course_description="Abnormal Psychology."; max_capacity=85 ;;
            11) discipline="BA"; course_number=101; course_description="Principles of Management."; max_capacity=60 ;;
            12) discipline="BA"; course_number=102; course_description="Marketing Fundamentals."; max_capacity=65 ;;
            13) discipline="PHYS"; course_number=101; course_description="General Physics I."; max_capacity=70 ;;
            14) discipline="PHYS"; course_number=102; course_description="General Physics II."; max_capacity=65 ;;
            15) discipline="CHEM"; course_number=101; course_description="General Chemistry I."; max_capacity=80 ;;
            16) discipline="CHEM"; course_number=102; course_description="General Chemistry II."; max_capacity=75 ;;
            17) discipline="MATH"; course_number=101; course_description="Calculus I."; max_capacity=50 ;;
            18) discipline="MATH"; course_number=102; course_description="Calculus II."; max_capacity=55 ;;
            19) discipline="LAW"; course_number=101; course_description="Introduction to Law."; max_capacity=40 ;;
            20) discipline="LAW"; course_number=102; course_description="Criminal Law."; max_capacity=45 ;;
            *) discipline="UND"; course_number=$i; course_description="Exploring various courses."; max_capacity=30 ;;
        esac

        INSERT_QUERY="
            INSERT INTO course (discipline, course_number, description, max_capacity)
            VALUES ('$discipline', $course_number, '$course_description', $max_capacity)
            ON CONFLICT (discipline, course_number) DO NOTHING;" 2>&1

        docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}" > /dev/null
    done

    >&2 echo ">> seeded $NUM_COURSES courses"
else
    echo "skipping test data seeding"
fi
