# Experiment 5 — Spring Boot REST API Design & Exception Handling

Post Composer mini-project: React frontend + Spring Boot backend with CRUD, scheduling, validation, standardized responses, CORS, logging filter, global exception handling, and MDC correlation IDs.

## Prerequisites

- **Java 17+**
- **Node.js** (v18+) and **npm**

## 1. Backend (Spring Boot)

```bash
cd exp_5_code/backend
```

Windows:
```cmd
gradlew.bat bootRun
```

Mac/Linux:
```bash
./gradlew bootRun
```

Backend: `http://localhost:8080`  
H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:testdb`)

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/posts` | List all posts |
| GET | `/api/posts/{id}` | Get one post |
| POST | `/api/posts` | Create (publish) post |
| POST | `/api/posts/schedule` | Schedule a post |
| PUT | `/api/posts/{id}` | Update post |
| DELETE | `/api/posts/{id}` | Delete post |

All responses use:

```json
{ "status": "success|error", "message": "...", "data": {} }
```

Watch the backend console for:
- Request URI + duration (LoggingFilter)
- `[correlationId]` on every log line (MDC + CorrelationInterceptor)

## 2. Frontend (React + Vite)

New terminal:

```bash
cd exp_5_code/frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Testing checklist (matches lab assignments)

1. **CRUD + schedule** — create, edit, delete posts; use “Schedule for later”.
2. **Validation** — send empty content (e.g. via Postman) → `400` + validation errors.
3. **Logging filter** — console shows URI and ms duration.
4. **Exception handling** — invalid body / missing id → standardized error `ApiResponse`.
5. **Correlation ID** — logs include `[uuid]`; response header `X-Correlation-Id`.

## Troubleshooting

- Ports **8080** / **5173** already in use → stop the other process first.
- Frontend cannot connect → ensure backend is running before refreshing the UI.
