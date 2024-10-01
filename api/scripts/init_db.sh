#!/usr/bin/env bash

# set -x 
# ^ Enable debugging
set -eo pipefail 
# ^ Ensures the script exits immediately if any command fails (-e) and that the exit status of a pipeline 
# is determined by the last non-zero status

ENV_FILE=".env"
SCHEMA_FILE="./scripts/db.sql"

if [ -f "$ENV_FILE" ]; then
    # Load environment variables from .env file
    source "$ENV_FILE"
fi

if ! [ -x "$(command -v docker)" ]; then
    echo >&2 "Error: docker is not installed."
    exit 1
fi

# Check if a custom user has been set, otherwise default to 'admin'
DB_USER=${MARIADB_USER:=admin}

# Check if a custom user has been set, otherwise default to 'password'
DB_PASSWORD="${MARIADB_PASSWORD:=password}"

# Check if a custom host has been set, otherwise default to '127.0.0.1'
DB_HOST="${MARIADB_HOST:=127.0.0.1}"

# Check if a custom port has been set, otherwise default to '3306'
DB_PORT="${MARIADB_PORT:=3306}"

# Check if a custom database name has been set, otherwise default to 'react_backend'
DB_NAME="${MARIADB_DATABASE:=react_backend}"

# Allow to skip Docker if a dockerized MariaDB database is already running
if [[ -z "${SKIP}" ]]; then
    docker run \
        --name "mariadb-local" \
        -e MARIADB_USER="${DB_USER}" \
        -e MARIADB_PASSWORD="${DB_PASSWORD}" \
        -e MARIADB_DATABASE="${DB_NAME}" \
        -e MARIADB_ROOT_HOST="localhost" \
        -e MARIADB_RANDOM_ROOT_PASSWORD=" " \
        -p ${DB_HOST}:${DB_PORT}:3306 \
        -d mariadb:11
fi

# Keep pinging MariaDB until it's ready
until docker exec mariadb-local mariadb -h "${DB_HOST}" -u "${DB_USER}" -p"${DB_PASSWORD}" -P ${DB_PORT} -e 'SELECT 1'; do
    >&2 echo "MariaDB is still unavailable - sleeping"
    sleep 2
done

echo "MariaDB is up on ${DB_HOST}:${DB_PORT} - ready for connections"

# Execute the SQL commands from db.sql
if [ -f "$SCHEMA_FILE" ]; then
    docker exec -i mariadb-local mariadb -h "${DB_HOST}" -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" < "$SCHEMA_FILE"
    echo "tables created successfully and test data inserted for database: '${DB_NAME}'"
else
    >&2 echo "error: file '$SCHEMA_FILE' not found"
    exit 1
fi
