# ItsTimeDoLearn — Backend

API REST do projeto ItsTimeDoLearn — plataforma de estimulação cognitiva para crianças neurodivergentes.

## Stack

- Node.js + TypeScript
- Express 4
- mysql2 (preparado, ainda não ativado)
- dotenv, helmet, cors

## Rodar em desenvolvimento

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

O servidor sobe em `http://localhost:3001`.

## Endpoints disponíveis

```
GET  /api/health
GET  /api/children
GET  /api/children/:id
POST /api/children          body: { name, birthdate?, notes? }

GET  /api/activities
GET  /api/activities/:code

# Filtros disponíveis em GET /api/activities:
#   ?category=executive_functions
#   ?status=interactive_game
#   ?ageMin=5&ageMax=10
#   ?requiresMediation=true

GET  /api/recommendations/children/:childId
```

## Padrão de resposta

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": "mensagem de erro" }
```

## Estrutura

```
src/
├── app.ts              Express + middlewares
├── server.ts           Ponto de entrada
├── config/env.ts       Variáveis de ambiente tipadas
├── common/             Helpers reutilizáveis (response, errors)
├── middlewares/        errorHandler, notFound
├── routes/index.ts     Roteador raiz
├── modules/
│   ├── children/       Controller → Service → Repository
│   ├── activities/     Controller → Service → Repository
│   └── recommendations/
└── database/
    ├── connection.ts   Pool MySQL (preparado)
    ├── mock/           Dados iniciais em memória
    └── schema/         SQL inicial para quando o banco for ativado
```

## Ativar MySQL

1. Configure as variáveis `DB_*` no `.env`
2. Execute `src/database/schema/initial.sql` no banco
3. Em cada `*.repository.ts`, substitua os métodos mock por queries usando `getPool()` de `database/connection.ts`
4. Chame `testConnection()` em `server.ts` antes de `app.listen()`

## Scripts

```bash
npm run dev        # desenvolvimento com hot reload
npm run build      # compila para dist/
npm run start      # executa dist/server.js
npm run type-check # verifica TypeScript sem compilar
```
