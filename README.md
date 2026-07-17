# DevBoard

The repository is intentionally split by responsibility:

- `frontend/` — React + Vite user interface
- `backend/` — Maven Spring Boot microservices: API Gateway, Auth, Project, and Task

## Run everything with Docker

Copy `.env.example` to `.env`, set a strong `JWT_SECRET`, then run:

```powershell
docker compose up --build
```

Open the UI at `http://localhost:5173`; its API requests are proxied to the gateway at `http://localhost:8080`.

## Local development

```powershell
cd backend
mvn package -DskipTests

cd ../frontend
npm install
npm run dev
```

The Vite development server proxies `/auth`, `/projects`, and `/tasks` to the Gateway.
