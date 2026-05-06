# SECURITY.md

# Cyber Asset Discovery Scanner — Security Documentation

## 1. Executive Summary

Cyber Asset Discovery Scanner is a web-based security tool used to manage and analyze cyber assets such as IP addresses, domains, services, and risk scores.

The project includes:
- Spring Boot backend
- React frontend
- PostgreSQL database
- Flask AI microservice
- JWT-based authentication
- Docker-based deployment

Security was tested across backend APIs, frontend flows, database operations, AI prompt handling, authentication, authorization, CORS, and input validation.

The main goal of this security review is to make sure the application is safe for Demo Day and follows basic secure coding practices.

---

## 2. Threat Model

| Area | Possible Threat | Risk | Protection Added |
|---|---|---|---|
| Login/API access | Unauthorized access | High | JWT authentication |
| Asset APIs | Access without token | High | Protected routes and backend security |
| Database | SQL Injection | High | JPA Repository and parameterized queries |
| Forms | Invalid or malicious input | Medium | Backend and frontend validation |
| AI service | Prompt injection | High | Prompt filtering and input sanitization |
| Browser access | CORS misuse | Medium | Controlled allowed origin |
| API abuse | Too many requests | Medium | Rate limiting planned/added |
| Secrets | API keys exposed | High | `.env` ignored and `.env.example` used |
| Frontend | Broken access control | Medium | AuthContext and ProtectedRoute |

---

## 3. Security Testing Performed

The following testing was completed:

### Authentication Testing
- Tried accessing protected pages without login.
- Verified unauthorized users are redirected to login.
- Tested backend API without JWT token.
- Expected result: API returns `401 Unauthorized`.

### Input Validation Testing
Tested invalid inputs in asset create/edit forms:
- Empty asset name
- Invalid IP address format
- Negative risk score
- Risk score above allowed range
- Empty required fields

Expected result:
- Frontend shows validation message.
- Backend rejects invalid data with proper error response.

### SQL Injection Testing
Tested inputs such as:

```text
' OR '1'='1
admin'--
DROP TABLE assets;