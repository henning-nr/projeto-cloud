# projeto-cloud

Projeto base fullstack: React (Vite) + Express + PostgreSQL, dockerizado para deploy no Coolify.

## Estrutura
- `frontend/` – React; servido por nginx, que faz proxy de `/api` para o backend
- `backend/` – API Express (`/api/health`, `/api/items`)
- `docker-compose.yml` – frontend, backend e Postgres (volume persistente)

## Rodar localmente
```bash
cp .env.example .env   # ajuste a senha
docker compose up --build
```
Abra http://localhost (adicione `ports: ["80:80"]` ao serviço `frontend` para uso local).

Sem Docker: `cd backend && npm i && DATABASE_URL=... npm run dev` e `cd frontend && npm i && npm run dev`.

## Deploy no Coolify
1. Novo recurso → *Docker Compose* apontando para este repositório.
2. Defina as variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
3. Atribua o domínio ao serviço `frontend` (porta 80).
