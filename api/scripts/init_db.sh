#!/usr/bin/env bash

### Using Docker to setup local PostgreSQL database for testing and development

# set -x 
# ^ Enable debugging
set -eo pipefail 
# ^ Ensures the script exits immediately if any command fails (-e) and that the exit status of a pipeline 
# is determined by the last non-zero status

ENV_FILE=".env"
DB_FILE="./scripts/test_db.sql"

if [ -f "$ENV_FILE" ]; then
    # Load environment variables from .env file
    source "$ENV_FILE"
fi

if ! [ -x "$(command -v docker)" ]; then
    echo >&2 "Error: docker is not installed"
    exit 1
fi

if ! [ -x "$(command -v psql)" ]; then
    echo >&2 "Error: psql is not installed."
    echo >&2 "Use:"
    echo >&2 "    brew install libpq for macOS using Homebrew or alternative for preferred OS"
    echo >&2 "to install it."
    exit 1
fi

# Use the PGUSER environment variable or default to 'postgres'
: "${PGUSER:=postgres}"

# Use the PGPASSWORD environment variable or default to 'password'
: "${PGPASSWORD:=password}"

# Use the PGDATABASE environment variable or default to 'react_backend'
: "${PGDATABASE:=react_backend}"

# Use the PGHOST environment variable or default to '127.0.0.1'
: "${PGHOST:=127.0.0.1}"

# Allow to skip Docker if a dockerized Postgres database is already running
if [[ -z "${SKIP}" ]]
then
    docker run \
        --name "postgres-local" \
        -e POSTGRES_USER=${PGUSER} \
        -e POSTGRES_PASSWORD=${PGPASSWORD} \
        -e POSTGRES_DB=${PGDATABASE} \
        -p 5432:5432 \
        -d postgres:16-alpine \
        postgres -N 100 
        # In Postgres, the default limit is typically 100 open connections, 
        # minus 3 which are reserved for superusers 
        # (putting the default limit for unprivileged users at 97 connections)
fi

# Keep pinging Postgres until it's ready to accept commands
export PGPASSWORD
until psql -h ${PGHOST} -U "${PGUSER}" -d "postgres" -c '\q'; do
    >&2 echo "Postgres is still unavailable - sleeping"
    sleep 1 
done

echo "Postgres is up on ${PGHOST}:5432 - ready for connections"

# Execute the SQL commands from test_db.sql
if [ -f "$DB_FILE" ]; then
    psql -h "${PGHOST}" -U "${PGUSER}" -d "${PGDATABASE}" -f "$DB_FILE"
    echo "migration completed successfully for database: '${PGDATABASE}'"
else
    >&2 echo "error: file '$DB_FILE' not found"
    exit 1
fi
