# ItsTimeDoLearn

Plataforma de estimulação cognitiva para crianças neurodivergentes (TEA / TDAH).  
Minigames terapêuticos, acompanhamento por responsável, trilha de progresso e recomendações por perfil.

---

## Estrutura do projeto

```
ItsTimeDoLearn/
├── frontend/   React + TypeScript + Vite + Zustand + React Router
└── backend/    Node.js + TypeScript + Express (MySQL preparado)
```

---

## Rodar em desenvolvimento

### Backend (porta 3001)

```bash
cd backend
cp .env.example .env   # preencher se necessário
npm install
npm run dev
```

Verificar: `GET http://localhost:3001/api/health`

### Frontend (porta 5173)

```bash
cd frontend
cp .env.example .env   # já vem com VITE_API_URL=http://localhost:3001/api
npm install
npm run dev
```

Acesse: `http://localhost:5173`

---

## Rotas do frontend

| Rota | Página |
|---|---|
| `/` | Lista de crianças |
| `/children/:id` | Dashboard da criança |
| `/children/:id/play/:gameCode` | Mini-jogo |
| `/children/:id/caregiver` | Painel do responsável |
| `/children/:id/trail` | Jornada e conquistas |
| `/children/:id/activity/:activityCode` | Atividade guiada |
| `/references` | Referências metodológicas |

## Endpoints do backend

| Método + Rota | Descrição |
|---|---|
| `GET /api/health` | Health check |
| `GET/POST /api/children` | Crianças |
| `GET /api/activities` | Catálogo de atividades |
| `GET/POST /api/sessions` | Sessões de jogo |
| `GET/POST /api/goals` + PATCH progress/toggle | Metas terapêuticas |
| `GET/POST /api/observations` | Observações pós-sessão |
| `GET/PUT /api/weekly-plans/children/:id` | Plano semanal |
| `GET/PUT /api/adaptive-profiles/...` | Dificuldade adaptativa |
| `GET /api/recommendations/children/:id` | Recomendações |

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend UI | React 19 + TypeScript |
| Estado | Zustand 5 + localStorage |
| Rotas | React Router 7 |
| Build | Vite 8 |
| Backend | Node.js + Express 4 |
| Banco (preparado) | MySQL 2 |
| Segurança | Helmet + CORS |

---

> Este sistema não substitui avaliação clínica. As atividades são inspiradas em princípios de estimulação cognitiva, serious games e participação do cuidador.
