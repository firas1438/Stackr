# Stackr - AI-Powered Architecture Designer

**Stackr** helps developers design modern software architectures. Describe your project, pick technologies layer by layer, and get an AI-generated explanation, Mermaid diagram, and alternative stack suggestions.

## Features

- **Interactive tech picker** — categories and technologies loaded from PostgreSQL
- **AI architecture generation** — Google Gemini (`gemini-2.5-flash`)
- **History feed** — browse recent stacks generated on the platform
- **Dark SaaS UI** — React, Vite, Tailwind, shadcn/ui
- **Brand logos** — theSVG → favicon proxy → initials (same strategy as stack-picker)

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind, shadcn/ui, React Router, TanStack Query |
| Backend | NestJS, Prisma |
| Database | PostgreSQL |
| AI | `@google/genai` |

## Project structure

```
stackr/
  frontend/          # React app
  backend/           # NestJS API
  stack-picker-example/   # reference only
```

## Getting started

### 1. Prerequisites

- Node.js 20+
- Docker (for local Postgres)

### 2. Install dependencies

Install dependencies for both projects:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment

Configure environment variables for both:

**Backend:**
Copy `backend/.env.example` to `backend/.env` and add your database config & Gemini key:
```bash
cd backend
cp .env.example .env
```

**Frontend:**
Copy `frontend/.env.example` to `frontend/.env`:
```bash
cd frontend
cp .env.example .env
```

### 4. Start Postgres

Run the local PostgreSQL database using docker compose:
```bash
docker compose up -d
```

### 5. Database migrate & seed

Run the database migrations and seed it from the backend folder:
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 6. Run dev servers

Run both applications:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3000/api/v1

## API routes

| Method | Route | Description |
|--------|--------|-------------|
| GET | `/health` | Health check |
| GET | `/catalog` | Categories + technologies |
| GET | `/favicon?domain=` | Favicon proxy for logos |
| POST | `/stacks` | Generate architecture (idea + selections) |
| GET | `/stacks` | History list |
| GET | `/stacks/:id` | Single stack detail |

## Database tables

| Table | Purpose |
|-------|---------|
| `category` | Stack layers (Frontend, Database, …) |
| `technology` | Pickable tools per category |
| `stack` | One AI result (idea, selections, outputs) |

## Future roadmap

- Docker production images
- Terraform + AWS hosting
- GitHub Actions CI/CD
- AI-generated diagram images (Imagen)
