#!/usr/bin/env bash

# set -x
set -eo pipefail 

# Initializes PostgreSQL DB using Docker
# Optionally insert a specified number of users into DB

# When changing PGUSER, PGPASSWORD, PGDATABASE, or PGHOST, make sure to
# update the `config/local.toml` to reflect the changes

if ! [ -x "$(command -v docker)" ]; then
    echo >&2 "error: docker is not installed"
    exit 1
fi

PGUSER=admin
PGPASSWORD=password
PGDATABASE=react_backend
PGHOST=127.0.0.1

SUPERUSER=postgres
SUPERUSER_PWD=password

CONTAINER_NAME="rb-pg"

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
    postgres:17-alpine -N 1000 \
    > /dev/null

until [ "$(docker inspect -f "{{.State.Health.Status}}" ${CONTAINER_NAME})" == "healthy" ]; do     
    >&2 echo "postgres is still unavailable - sleeping"
    sleep 1 
done

echo "postgres is up on ${PGHOST}:5432 - ready for connections..."

CREATE_QUERY="CREATE USER ${PGUSER} WITH PASSWORD '${PGPASSWORD}';"
docker exec -it "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -c "${CREATE_QUERY}" > /dev/null

CREATE_DB_QUERY="CREATE DATABASE ${PGDATABASE};"
docker exec -it "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -c "${CREATE_DB_QUERY}" > /dev/null

GRANT_SCHEMA_QUERY="GRANT ALL PRIVILEGES ON SCHEMA public TO ${PGUSER};"
docker exec -it "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -d "${PGDATABASE}" -c "${GRANT_SCHEMA_QUERY}" > /dev/null

echo "database '${PGDATABASE}' created successfully - inserting tables..."

docker exec -it "${CONTAINER_NAME}" psql -h "${PGHOST}" -U "${PGUSER}" -d "${PGDATABASE}" -f "./scripts/schema.sql" > /dev/null
echo "tables inserted successfully for database: '${PGDATABASE}'"

read -p "do you want to seed users? (y/n): " SEED_USERS

if [[ "$SEED_USERS" == "yes" || "$SEED_USERS" == "y" ]]; then
    echo "seeding users..."

    NUM_ADMINS_EXPECTED=2
    NUM_STUDENTS_EXPECTED=50
    NUM_INSTRUCTORS_EXPECTED=10

    NUM_ADMINS_ACTUAL=0
    NUM_STUDENT_ACTUAL=0
    NUM_INSTRUCTORS_ACTUAL=0

    # Fixed password hash for all users (password123)
    PASSWORD_HASH='$argon2id$v=19$m=65536,t=3,p=1$5/JDguSRQqYWps2/V1ruJA$X33IbsiipHnq+8nqj14aXMx0qUNXGfjiVBPV6dgFE+U'

    generate_details() {
        first_name=$(sed "$(jot -r 1 1 2047)q;d" ./scripts/names.txt | sed -e 's/[^a-zA-Z]//g')
        last_name=$(sed "$(jot -r 1 1 2047)q;d" ./scripts/names.txt | sed -e 's/[^a-zA-Z]//g')
        echo "${first_name}"
        echo "${last_name}"

        random_number=$((RANDOM % 900 + 100))
        echo "${first_name}" | tr '[:upper:]' '[:lower:]' | sed "s/\$/${random_number}/"
    }

    for i in $(seq 1 $NUM_ADMINS_EXPECTED); do
        while true; do
            details=($(generate_details))
            first_name=${details[0]}
            last_name=${details[1]}
            username=${details[2]}

            INSERT_QUERY="
                INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number, office)
                VALUES ('$username', '$first_name', '$last_name', '${PASSWORD_HASH}', 'ADMIN', '555-555-5555', 'Admin Office')
                ON CONFLICT (username) DO NOTHING;" 2>&1

            result=$(docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}")

            if [[ $result == *"INSERT 0 1"* ]]; then
                # Insert successfully
                ((NUM_ADMINS_ACTUAL++))
                break
            else
                echo >&2 "duplicate username found: $username. regenerating details..."
                continue
            fi   
        done
    done

    for i in $(seq 1 $NUM_STUDENTS_EXPECTED); do
        while true; do
            details=($(generate_details))
            first_name=${details[0]}
            last_name=${details[1]}
            username=${details[2]}

            INSERT_QUERY="
                INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number)
                VALUES ('$username', '$first_name', '$last_name', '${PASSWORD_HASH}', 'STUDENT', '555-555-5555')
                ON CONFLICT (username) DO NOTHING;" 2>&1

            result=$(docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}")

            if [[ $result == *"INSERT 0 1"* ]]; then
                # Insert successfully
                ((NUM_STUDENTS_ACTUAL++))
                break
            else
                echo >&2 "duplicate username found: $username. regenerating details..."
                continue
            fi   
        done
    done

    for i in $(seq 1 $NUM_INSTRUCTORS_EXPECTED); do
        while true; do
            details=($(generate_details))
            first_name=${details[0]}
            last_name=${details[1]}
            username=${details[2]}

            INSERT_QUERY="
                INSERT INTO users (username, first_name, last_name, password_hash, role, phone_number, office)
                VALUES ('$username', '$first_name', '$last_name', '${PASSWORD_HASH}', 'INSTRUCTOR', '555-555-5555', 'Instructor Office')
                ON CONFLICT (username) DO NOTHING;" 2>&1

            result=$(docker exec -it ${CONTAINER_NAME} psql -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -c "${INSERT_QUERY}")

            if [[ $result == *"INSERT 0 1"* ]]; then
                # Insert successfully
                ((NUM_INSTRUCTORS_ACTUAL++))
                break
            else
                echo >&2 "duplicate username found: $username. regenerating details..."
                continue
            fi   
        done
    done

    echo ">> seeded $NUM_ADMINS_ACTUAL admins"
    echo ">> seeded $NUM_STUDENTS_ACTUAL students"
    echo ">> seeded $NUM_INSTRUCTORS_ACTUAL instructors"
else
    echo "skipping user seeding"
fi
