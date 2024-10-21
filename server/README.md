# React Backend REST API

## Usage

### 1. **Install Node and Docker**

Ensure you have Node.js installed. See [Node.js](https://nodejs.org/en/download/package-manager)

Ensure you have Docker installed. See [Get Docker](https://docs.docker.com/get-started/get-docker/)

### 2. **Clone the Repository**

```bash
git clone https://github.com/Flaandan/CSC423_ReactBackend.git
```
```bash
cd CSC423_ReactBackend/server
```

### 3. **Run the API**

Rename `local.toml.example` and `production.toml.example` to `local.toml` and `production.toml`

```bash
mv ./config/local.toml.example ./config/local.toml
```

```bash
mv ./config/production.toml.example ./config/production.toml
```

Update the contents of these files to your specific configuration

Example:

```toml
[database]
PGUSER= "admin"
PGPASSWORD= "password"
PGDATABASE= "react_backend"
PGHOST = "127.0.0.1"

[server]
SERVER_HOST= "127.0.0.1"
SERVER_PORT= "8000"
JWT_SECRET= "secret"
```
> When changing PGUSER, PGPASSWORD, PGDATABASE, or PGHOST, make sure to update these values in `scripts/init_pg.sh` to reflect the changes

Run the `init_pg.sh` script to initialize a PostgreSQL database via Docker and optionally seed test users

```bash
./scripts/init_pg.sh
```

Install Dependencies:

```bash
npm install
```

Start in local environment:

```bash
npm run dev
```

Or start in production environment:

```bash
npm run prod
```

### 4. **Perform a Health Check**

To verify the API is running, perform a health check using the following `curl` command:

```bash
curl -v http://<your_host>:<your_port>/v1/health
```
> You should receive a 200 OK status and JSON response indicating the API status
