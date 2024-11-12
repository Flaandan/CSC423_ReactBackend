# React Backend REST API

## Usage

### 1. **Prerequisites**

- Ensure that you have [Node.js](https://nodejs.org/en/download/package-manager) installed

- Ensure that you have [Docker](https://docs.docker.com/get-started/get-docker/) installed

### 2. **Clone the Repository**

```bash
git clone https://github.com/Flaandan/CSC423_ReactBackend.git
```
```bash
cd CSC423_ReactBackend/server
```

### 3. **Create Production Configuration**

If running in production environment, create the `production.toml` file, if not skip this step:

```bash
touch ./config/production.toml
```

Update the contents of this file for your specific configuration. Example:

```toml
[database]
PGUSER= "admin"
PGPASSWORD= "password"
PGDATABASE= "react_backend"
PGHOST = "0.0.0.0"

[server]
SERVER_HOST= "0.0.0.0"
SERVER_PORT= "8080"
JWT_SECRET= "secret"

```
### 4. **Initialize Database**

If running in development environment, run the `init_db.sh` script to initialize a PostgreSQL database via Docker and optionally seed test data

> Will only read from `config/development.toml` file

```bash
./scripts/init_db.sh
```

### 5. **Install Dependencies**

```bash
npm install
```

### 6. **Run the API**

Run this command to start in development environment:

```bash
npm run dev
```

Or start in production environment:

```bash
npm run prod
```

### 7. **Perform a Health Check**

To verify the API is running, perform a health check using the following `curl` command:

```bash
curl -v http://<your_host>:<your_port>/v1/health
```
> Replace with the host and port shown after starting the server

> You should receive a `200 OK` status and JSON response indicating the API is available

### 8. **Access Docker Container**

To access the PostgreSQL Docker container, enter the following commmand:

```bash
docker exec -it rb-db /bin/bash
```
> Default container name should be `rb-db`

### 9. **Access Database within Docker Container**

```bash
psql -U admin -d react_backend
```
> Default user should be `admin`. Default database name should be `react_backend`
