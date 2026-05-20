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

```bash
npm install
```

### 3. Environment

Copy `.env.example` to `.env` and add your Gemini key:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY=your_key_here
```

### 4. Start Postgres

```bash
docker compose up -d
```

### 5. Database migrate & seed

```bash
npm run db:migrate
npm run db:seed
```

### 6. Run dev servers

```bash
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
