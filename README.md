# Stackr

An AI-powered tool that helps developers understand how their tech stack fits together. Describe your project, select technologies layer by layer, and get a clear architecture explanation, a visual diagram, and alternative stack suggestions tailored to your use case.

## Features

- **Interactive stack picker:** categories and technologies loaded from PostgreSQL.
- **AI architecture generation:** powered by Google Gemini (`gemini-2.5-flash`).
- **Visual diagrams:** auto-generated Mermaid flowcharts showing how every component connects.
- **Alternative stack suggestions:** AI recommends different approaches when a better fit exists.
- **History feed:** browse recent architectures generated on the platform.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TanStack Query, Tailwind CSS |
| Backend | NestJS, Prisma ORM |
| Database | PostgreSQL |
| Containerization | Docker, Docker Compose |
| AI | Google Gemini via `@google/genai` |
| Infrastructure | AWS (EC2, RDS, ALB, ASG) via Terraform |


## Getting Started

### - Local Development

Run the full stack locally with Docker Compose:

```bash
docker compose up -d
```

This starts the frontend, backend, and PostgreSQL database as three services. Visit http://localhost:5173.


### - AWS Deployment (Terraform)

Infrastructure is defined in the `infrastructure/` folder using Terraform.

```bash
cd infrastructure

terraform init
terraform plan
terraform apply
```

To destroy the infra:
```bash
terraform destroy
```

> Make sure `infrastructure/terraform.tfvars` is filled in using `terraform.tfvars.example` as a reference before running.

## API routes

| Method | Route | Description |
|--------|--------|-------------|
| GET | `/health` | Health check |
| GET | `/catalog` | Categories + technologies |
| GET | `/favicon?domain=` | Favicon proxy for logos |
| POST | `/stacks` | Generate architecture (idea + selections) |
| GET | `/stacks` | History list |
| GET | `/stacks/:id` | Single stack detail |

## Demo

![Stackr Demo](https://i.imgur.com/6eonqiI.gif)
