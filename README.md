# Full Stack Experiments

| Folder | Experiment |
|--------|------------|
| `exp-1` | Draft Management System (Draft Keeper) |
| `exp-2` | Draft Management System (Project Hug multi-platform composer) |
| `exp-3` | Draft Management System with Social Media Publishing |
| `exp-4` | React Lab Experiment 4 |
| `exp-5` | Spring Boot REST API Design & Exception Handling (OmniPost Composer) |

## Run

### exp-1 / exp-2
```bash
cd exp-1   # or exp-2
bun install
bun run dev
```

### exp-3 / exp-4
```bash
cd exp-3   # or exp-4
npm install
npm run dev
```

### exp-5 (React + Spring Boot)
```bash
# Terminal 1 — backend
cd exp-5/backend
./gradlew bootRun        # Windows: gradlew.bat bootRun

# Terminal 2 — frontend
cd exp-5/frontend
npm install
npm run dev
```

Open http://localhost:5173 (frontend) and http://localhost:8080 (API).
