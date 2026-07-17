# Backend microservices

This Maven reactor contains four independently deployable Spring Boot applications.

| Service | Port | Responsibility |
|---|---:|---|
| api-gateway | 8080 | Single public routing entry point |
| auth-service | 8081 | Users, JWTs, and hashed API keys |
| project-service | 8082 | Project ownership and CRUD |
| task-service | 8083 | Tasks, priority, due dates, and pagination |

Build all services with `mvn package -DskipTests` from this directory. The root `docker-compose.yml` provides MySQL and runs each service with environment-specific Spring configuration.
