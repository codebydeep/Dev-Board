# DevBoard

A full-stack Kanban project management app built with a Spring Boot microservices backend and a React + TypeScript frontend.

---

## Architecture

```
Browser
  └── Frontend (React + Vite)  :5173
        └── API Gateway         :8080   ← single public entry point
              ├── auth-service   :8081   ← users, JWTs, API keys
              ├── project-service :8082  ← projects & collaborators
              └── task-service   :8083   ← tasks, status, priority
                        │
                    MySQL :3307  +  Redis :6379
```

| Service          | Port | Responsibility                          |
|------------------|-----:|-----------------------------------------|
| frontend         | 5173 | React SPA served via Nginx              |
| api-gateway      | 8080 | Spring Cloud Gateway — routing + CORS   |
| auth-service     | 8081 | Register, login, JWT, API keys          |
| project-service  | 8082 | Project CRUD + collaborators            |
| task-service     | 8083 | Tasks with status, priority, pagination |

---

## Prerequisites

### Docker setup
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Compose v2)

### Local development setup
- Java 21+ — [Eclipse Temurin](https://adoptium.net/) recommended
- Maven 3.9+
- Node.js 20+
- Docker Desktop (for MySQL + Redis only)

---

## Option 1 — Run with Docker (recommended)

Everything — database, backend services, and frontend — runs in containers. No local Java or Node needed.

### 1. Clone and configure environment

```bash
git clone <repo-url>
cd Ms-App

# Copy the example env file and fill in your values
cp .env.example .env
```

Open `.env` and set your values:

```dotenv
# Must be at least 32 characters
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars

MYSQL_ROOT_PASSWORD=devboard-root
MYSQL_PASSWORD=devboard

# Leave blank — the bundled Redis has no auth by default
REDIS_PASSWORD=
```

### 2. Build backend JARs

The Docker images copy pre-built JARs rather than running Maven inside Docker, so build them first:

```bash
cd backend
mvn clean package -DskipTests
cd ..
```

### 3. Start the full stack

```bash
docker compose up --build
```

First run pulls base images and builds all containers (~3–5 min). Subsequent runs are faster.

### 4. Open the app

| URL                          | What                        |
|------------------------------|-----------------------------|
| http://localhost:5173        | Web UI                      |
| http://localhost:8080        | API Gateway (direct access) |
| http://localhost:3307        | MySQL (host-mapped port)    |

### Useful Docker commands

```bash
# Run in the background
docker compose up --build -d

# View logs for a specific service
docker compose logs -f auth-service

# Stop everything (keeps volumes)
docker compose down

# Stop and wipe the database volume
docker compose down -v

# Rebuild only one service after a code change
cd backend && mvn clean package -DskipTests && cd ..
docker compose up --build --no-deps -d project-service
```

---

## Option 2 — Local development

Run MySQL and Redis in Docker but start each Spring Boot service and the Vite dev server natively. This gives you hot-reload on both backend and frontend.

### 1. Start infrastructure only

```bash
docker compose -f docker-compose.infra.yml up -d
```

This starts:
- MySQL on `localhost:3307` (user: `devboard`, password: `devboard`, db: `devboard`)
- Redis on `localhost:6379`

### 2. Build and run backend services

```bash
cd backend
mvn clean package -DskipTests
```

Open four terminal tabs and start each service:

```bash
# Terminal 1 — Auth service
java -jar backend/auth-service/target/auth-service-1.0.0.jar

# Terminal 2 — Project service
java -jar backend/project-service/target/project-service-1.0.0.jar

# Terminal 3 — Task service
java -jar backend/task-service/target/task-service-1.0.0.jar

# Terminal 4 — API Gateway
java -jar backend/api-gateway/target/api-gateway-1.0.0.jar
```

All services connect to `localhost:3307` by default (configured in each `application.yml`). No extra environment variables needed for local dev.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server starts on `http://localhost:5173` and proxies `/auth`, `/projects`, and `/tasks` to the gateway at `http://localhost:8080`.

### Default local service URLs

| Service          | URL                        |
|------------------|----------------------------|
| Frontend (Vite)  | http://localhost:5173      |
| API Gateway      | http://localhost:8080      |
| Auth service     | http://localhost:8081      |
| Project service  | http://localhost:8082      |
| Task service     | http://localhost:8083      |
| MySQL            | localhost:3307             |
| Redis            | localhost:6379             |

---

## Environment variables reference

| Variable             | Required | Default (local dev)                                    | Description                        |
|----------------------|----------|--------------------------------------------------------|------------------------------------|
| `JWT_SECRET`         | Yes      | `development-secret-must-be-at-least-32-characters-long` | JWT signing key (min 32 chars)   |
| `MYSQL_ROOT_PASSWORD`| Docker   | `root`                                                 | MySQL root password                |
| `MYSQL_PASSWORD`     | Docker   | `devboard`                                             | MySQL app user password            |
| `REDIS_PASSWORD`     | No       | _(empty)_                                              | Redis auth password                |
| `DB_URL`             | No       | `jdbc:mysql://localhost:3307/devboard`                 | JDBC URL for backend services      |
| `DB_USER`            | No       | `devboard`                                             | Database username                  |
| `DB_PASSWORD`        | No       | `devboard`                                             | Database password                  |
| `AUTH_URL`           | No       | `http://localhost:8081`                                | Auth service base URL              |
| `PROJECT_URL`        | No       | `http://localhost:8082`                                | Project service base URL           |
| `TASK_URL`           | No       | `http://localhost:8083`                                | Task service base URL              |

---

## API overview

All requests go through the gateway at `http://localhost:8080`.

### Auth

| Method | Path                       | Auth            | Description                  |
|--------|----------------------------|-----------------|------------------------------|
| POST   | `/auth/register`           | —               | Create a new account         |
| POST   | `/auth/login`              | —               | Login, returns JWT           |
| GET    | `/auth/me`                 | Bearer JWT      | Get current user info        |
| POST   | `/auth/api-key`            | Bearer JWT      | Generate an API key          |
| GET    | `/auth/api-keys`           | Bearer JWT      | List your API keys           |
| DELETE | `/auth/api-keys/{id}`      | Bearer JWT      | Revoke an API key            |

### Projects

All project and task endpoints use `X-API-Key` header.

| Method | Path                                  | Description                  |
|--------|---------------------------------------|------------------------------|
| POST   | `/projects`                           | Create a project             |
| GET    | `/projects`                           | List your projects           |
| GET    | `/projects/{id}`                      | Get a project                |
| PUT    | `/projects/{id}`                      | Update a project             |
| DELETE | `/projects/{id}`                      | Soft-delete a project        |
| GET    | `/projects/{id}/export`               | Export project + tasks (JSON)|
| POST   | `/projects/{id}/collaborators`        | Add a collaborator by userId |
| GET    | `/projects/{id}/collaborators`        | List collaborators           |
| DELETE | `/projects/{id}/collaborators/{uid}`  | Remove a collaborator        |

### Tasks

| Method | Path                          | Description                           |
|--------|-------------------------------|---------------------------------------|
| POST   | `/projects/{id}/tasks`        | Create a task                         |
| GET    | `/projects/{id}/tasks`        | List tasks (paginated, `?page=&size=`)|
| PUT    | `/tasks/{id}`                 | Update a task (title, status, etc.)   |
| DELETE | `/tasks/{id}`                 | Soft-delete a task                    |

**Task status values:** `TODO` · `IN_PROGRESS` · `DONE`  
**Task priority values:** `LOW` · `MEDIUM` · `HIGH`

### Quick example (curl)

```bash
# 1. Register
curl -s -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"password123"}'

# 2. Login → copy the accessToken
curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"password123"}'

# 3. Generate API key (replace <JWT> with accessToken from step 2)
curl -s -X POST http://localhost:8080/auth/api-key \
  -H "Authorization: Bearer <JWT>"

# 4. Create a project (replace <API_KEY> with key from step 3)
curl -s -X POST http://localhost:8080/projects \
  -H "X-API-Key: <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Project","description":"Getting started"}'

# 5. Add a task
curl -s -X POST http://localhost:8080/projects/1/tasks \
  -H "X-API-Key: <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Design the UI","priority":"HIGH"}'
```

A [Postman collection](./backend/postman/DevBoard.postman_collection.json) with all endpoints is included. Import it and set the `baseUrl`, `jwt`, and `apiKey` collection variables.

---

## Project structure

```
Ms-App/
├── .env                        # Your local secrets (git-ignored)
├── .env.example                # Template — copy to .env
├── docker-compose.yml          # Full stack (all services + infra)
├── docker-compose.infra.yml    # Infra only (MySQL + Redis)
├── mysql-init/
│   └── 01-schema.sql           # DB schema, runs once on first boot
├── backend/
│   ├── pom.xml                 # Maven reactor (parent POM)
│   ├── api-gateway/            # Spring Cloud Gateway  :8080
│   ├── auth-service/           # Auth + JWT + API keys :8081
│   ├── project-service/        # Projects + collabs    :8082
│   ├── task-service/           # Tasks                 :8083
│   └── postman/
│       └── DevBoard.postman_collection.json
└── frontend/
    ├── src/
    │   ├── main.tsx            # Entire React app (single file)
    │   └── styles.css
    ├── nginx.conf              # Nginx config for Docker
    ├── vite.config.ts          # Vite dev server + proxy
    └── package.json
```

---

## Troubleshooting

**`Invalid or corrupt jarfile` on api-gateway**  
The JAR from a previous build may be stale. Run `mvn clean package -DskipTests` inside `backend/` to force a fresh build, then `docker compose up --build`.

**500 errors on project/task endpoints**  
Make sure the backend was compiled with the `-parameters` flag. The root `pom.xml` already includes `<parameters>true</parameters>` in the compiler plugin. If you're running an older build, rebuild with `mvn clean package -DskipTests`.

**Port 3306 already in use**  
MySQL is mapped to `3307` on the host specifically to avoid this. If `3307` is also taken, change the host port in `docker-compose.yml` or `docker-compose.infra.yml` and update `DB_URL` accordingly.

**Frontend shows blank page / Nginx 500**  
Ensure the Vite build completed successfully. Check `docker compose logs frontend`. If the `dist/` folder is missing, the TypeScript compilation may have failed — run `npm run build` inside `frontend/` locally to see the error.

**Services can't reach each other inside Docker**  
All services communicate over the default Docker Compose network using their service names (e.g., `http://auth-service:8081`). These names only resolve inside the Docker network — not from your host machine.
