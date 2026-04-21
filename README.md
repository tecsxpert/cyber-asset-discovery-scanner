# Tool-95 — Cyber Asset Discovery Scanner

A full-stack AI-powered web application for discovering and managing cyber assets.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3.x, PostgreSQL 15, Redis 7, Flyway, Spring Security + JWT
- **AI Service**: Python 3.11, Flask 3.x, Groq API (LLaMA-3.3-70b)
- **Frontend**: React 18 + Vite, Tailwind CSS, Axios
- **Infrastructure**: Docker + Docker Compose

## Quick Start

```bash
cp .env.example .env
# Fill in your values in .env
docker-compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- AI Service: http://localhost:5000/health
