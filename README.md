# ItsTimeDoLearn

Plataforma de estimulação cognitiva para crianças neurodivergentes (TEA / TDAH).  
Minigames terapêuticos, acompanhamento por responsável, trilha de progresso e recomendações por perfil.

***

## Estrutura do projeto

```text
ItsTimeDoLearn/
├── frontend/   React + TypeScript + Vite + Zustand + React Router
└── backend/    Node.js + TypeScript + Express (MySQL preparado)
```

***

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

***

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

***

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

***

## Banco de dados MySQL

Abaixo está o script base usado para estruturar o banco `its_time_do_learn`, mostrando como o projeto foi pensado e codado na camada de persistência.

### Criar banco

```sql
CREATE DATABASE its_time_do_learn
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE its_time_do_learn;
```

### Tabela `children`

```sql
CREATE TABLE children (
    id          CHAR(36)      NOT NULL DEFAULT (UUID()),
    name        VARCHAR(100)  NOT NULL,
    avatar      VARCHAR(10),
    birthdate   DATE,
    notes       TEXT,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```

### Tabela `caregivers`

```sql
CREATE TABLE caregivers (
    id                     CHAR(36)     NOT NULL DEFAULT (UUID()),
    name                   VARCHAR(100) NOT NULL,
    relation               ENUM('mãe','pai','responsável legal','terapeuta','professor','outro') NOT NULL,
    phone                  VARCHAR(20),
    email                  VARCHAR(100),
    monitoring_preferences JSON,
    notes                  TEXT,
    created_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_caregiver_email (email)
);
```

### Tabela `caregiver_children`

```sql
CREATE TABLE caregiver_children (
    caregiver_id  CHAR(36) NOT NULL,
    child_id      CHAR(36) NOT NULL,
    linked_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (caregiver_id, child_id),
    INDEX idx_cc_child (child_id),
    FOREIGN KEY (caregiver_id) REFERENCES caregivers(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id)     REFERENCES children(id)   ON DELETE CASCADE
);
```

### Tabela `activities`

```sql
CREATE TABLE activities (
    id                     VARCHAR(20)  NOT NULL,
    code                   VARCHAR(50)  NOT NULL UNIQUE,
    name                   VARCHAR(100) NOT NULL,
    description            TEXT,
    functional_objective   TEXT,
    category               ENUM('executive_functions','sensory_regulation','social_emotional','attention_focus','language_communication','routine_organization','motor_skills') NOT NULL,
    primary_skill          VARCHAR(50)  NOT NULL,
    secondary_skills       JSON,
    age_range_min          TINYINT UNSIGNED NOT NULL DEFAULT 3,
    age_range_max          TINYINT UNSIGNED NOT NULL DEFAULT 14,
    recommended_profiles   JSON,
    caution_profiles       JSON,
    sensory_sensitivities  JSON,
    initial_difficulty     ENUM('easy','medium','hard') NOT NULL DEFAULT 'easy',
    suggested_duration_min TINYINT UNSIGNED,
    requires_mediation     BOOLEAN NOT NULL DEFAULT FALSE,
    status                 ENUM('interactive_game','guided_activity','offline_assisted') NOT NULL,
    emoji                  VARCHAR(10),
    PRIMARY KEY (id),
    INDEX idx_activity_category (category),
    INDEX idx_activity_status   (status)
);
```

### Tabela `game_sessions`

```sql
CREATE TABLE game_sessions (
    id               CHAR(36)           NOT NULL DEFAULT (UUID()),
    child_id         CHAR(36)           NOT NULL,
    activity_code    VARCHAR(50)        NOT NULL,
    started_at       DATETIME           NOT NULL,
    ended_at         DATETIME,
    duration_seconds MEDIUMINT UNSIGNED,
    success          BOOLEAN            NOT NULL DEFAULT FALSE,
    meta             JSON,
    created_at       DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_gs_child    (child_id),
    INDEX idx_gs_activity (activity_code),
    INDEX idx_gs_started  (child_id, started_at),
    FOREIGN KEY (child_id)      REFERENCES children(id)   ON DELETE CASCADE,
    FOREIGN KEY (activity_code) REFERENCES activities(code)
);
```

### Tabela `session_observations`

```sql
CREATE TABLE session_observations (
    id                CHAR(36)         NOT NULL DEFAULT (UUID()),
    session_id        CHAR(36)         NOT NULL,
    child_id          CHAR(36)         NOT NULL,
    activity_code     VARCHAR(50)      NOT NULL,
    needed_help       BOOLEAN          NOT NULL DEFAULT FALSE,
    focus_level       TINYINT UNSIGNED NOT NULL CHECK (focus_level BETWEEN 1 AND 5),
    frustration_level TINYINT UNSIGNED NOT NULL CHECK (frustration_level BETWEEN 1 AND 5),
    engagement_level  TINYINT UNSIGNED NOT NULL CHECK (engagement_level BETWEEN 1 AND 5),
    notes             TEXT,
    recorded_at       DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_so_child   (child_id),
    INDEX idx_so_session (session_id),
    FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id)   REFERENCES children(id)      ON DELETE CASCADE
);
```

### Tabela `therapeutic_profiles`

```sql
CREATE TABLE therapeutic_profiles (
    id                    CHAR(36) NOT NULL DEFAULT (UUID()),
    child_id              CHAR(36) NOT NULL UNIQUE,
    conditions            JSON,
    interests             JSON,
    sensory_sensitivities JSON,
    main_difficulties     JSON,
    ideal_session_minutes TINYINT UNSIGNED,
    support_level         ENUM('independent','minimal','moderate','full') NOT NULL DEFAULT 'minimal',
    engagement_style      ENUM('visual','kinesthetic','auditory','mixed') NOT NULL DEFAULT 'visual',
    therapeutic_notes     TEXT,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
```

### Tabela `therapeutic_goals`

```sql
CREATE TABLE therapeutic_goals (
    id            CHAR(36)      NOT NULL DEFAULT (UUID()),
    child_id      CHAR(36)      NOT NULL,
    skill         ENUM('sequencing','attention','memory','impulse_control','focus','routine_execution','social_interaction','emotional_regulation','sensory_regulation','communication') NOT NULL,
    description   TEXT          NOT NULL,
    target_value  DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit          VARCHAR(50)   NOT NULL,
    active        BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_tg_child  (child_id),
    INDEX idx_tg_active (child_id, active),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
```

### Tabela `weekly_plans`

```sql
CREATE TABLE weekly_plans (
    id         CHAR(36) NOT NULL DEFAULT (UUID()),
    child_id   CHAR(36) NOT NULL UNIQUE,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
```

### Tabela `weekly_plan_entries`

```sql
CREATE TABLE weekly_plan_entries (
    id            CHAR(36)    NOT NULL DEFAULT (UUID()),
    plan_id       CHAR(36)    NOT NULL,
    day           ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
    activity_code VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_wpe_plan (plan_id),
    FOREIGN KEY (plan_id)       REFERENCES weekly_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_code) REFERENCES activities(code)
);
```

### Tabela `adaptive_profiles`

```sql
CREATE TABLE adaptive_profiles (
    id                CHAR(36)    NOT NULL DEFAULT (UUID()),
    child_id          CHAR(36)    NOT NULL,
    game_code         VARCHAR(50) NOT NULL,
    current_level     ENUM('easy','medium','hard') NOT NULL DEFAULT 'easy',
    sessions_at_level TINYINT UNSIGNED             NOT NULL DEFAULT 0,
    updated_at        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_adaptive_child_game (child_id, game_code),
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
```

### Conferência final

```sql
SHOW TABLES;
```

***

## Observações sobre a modelagem

- O banco separa bem crianças, responsáveis, atividades, sessões, observações e metas terapêuticas.
- O uso de `JSON` ajuda a guardar perfis adaptativos, sensibilidades e preferências sem travar a evolução inicial do sistema.
- As tabelas de plano semanal e dificuldade adaptativa deixam o backend pronto para personalização por criança.
- `UUID()` e chaves estrangeiras com `ON DELETE CASCADE` facilitam integridade e manutenção dos relacionamentos.

***

> Este sistema não substitui avaliação clínica. As atividades são inspiradas em princípios de estimulação cognitiva, serious games e participação do cuidador.
