# Experiment 5 — Spring Boot REST API Design & Exception Handling

OmniPost Composer: React frontend + Spring Boot backend with CRUD, post scheduling, Bean Validation, standardized `ApiResponse`, CORS, logging filter, `@ControllerAdvice`, and MDC correlation IDs.

See [setup_instructions.md](./setup_instructions.md) for full details.

## Quick start

**Backend** (Java 17+):
```bash
cd backend
gradlew.bat bootRun   # Windows
./gradlew bootRun     # Mac/Linux
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api/posts
