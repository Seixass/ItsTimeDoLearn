-- =============================================================
-- ItsTimeDoLearn — Seed de dados de exemplo
-- Execute APÓS o initial.sql:
--   mysql -u root -p its_time_do_learn < src/database/schema/seed.sql
-- =============================================================

USE its_time_do_learn;

-- =============================================================
-- CHILDREN — 3 crianças com perfis neurodivergentes distintos
-- =============================================================
INSERT INTO children (id, name, avatar, birthdate, notes) VALUES
(
  'child-0001-0000-0000-000000000001',
  'Ana Luiza Ferreira',
  '🐱',
  '2016-03-15',
  'Gosta muito de animais e de atividades com sequências visuais. Responde bem a elogios. Sensível a barulhos altos.'
),
(
  'child-0002-0000-0000-000000000002',
  'Pedro Henrique Costa',
  '🚀',
  '2015-07-22',
  'Muito curioso, prefere jogos com figuras coloridas e desafios rápidos. Alta agitação motora antes das sessões.'
),
(
  'child-0003-0000-0000-000000000003',
  'Sofia Mendes',
  '🌸',
  '2017-11-08',
  'Comunicativa em ambientes familiares. Dificuldade com transições abruptas. Responde muito bem a agenda visual.'
);

-- =============================================================
-- CAREGIVERS — 4 responsáveis
-- =============================================================
INSERT INTO caregivers (id, name, relation, phone, email, monitoring_preferences, notes) VALUES
(
  'cg000001-0000-0000-0000-000000000001',
  'Maria Ferreira',
  'mãe',
  '(11) 98765-1001',
  'maria.ferreira@email.com',
  '["Receber alertas de progresso", "Acompanhar metas semanais", "Ver histórico de sessões"]',
  'Participa ativamente das sessões. Disponível nas tardes de segunda a sexta.'
),
(
  'cg000002-0000-0000-0000-000000000002',
  'Ricardo Costa',
  'pai',
  '(21) 97654-2002',
  'ricardo.costa@email.com',
  '["Ver histórico de sessões", "Receber recomendações"]',
  'Prefere relatórios resumidos por e-mail. Disponível nos fins de semana.'
),
(
  'cg000003-0000-0000-0000-000000000003',
  'Dra. Beatriz Rocha',
  'terapeuta',
  '(11) 3456-7890',
  'beatriz.rocha@clinica.com.br',
  '["Acompanhar metas semanais", "Ver histórico de sessões", "Receber alertas de progresso", "Receber recomendações"]',
  'Terapeuta ocupacional. Atende Ana Luiza e Sofia. CRO-SP 12345.'
),
(
  'cg000004-0000-0000-0000-000000000004',
  'Fernanda Mendes',
  'mãe',
  '(31) 99123-4004',
  'fernanda.mendes@email.com',
  '["Receber alertas de progresso", "Acompanhar metas semanais"]',
  'Muito engajada. Realiza as atividades guiadas em casa junto com Sofia.'
);

-- =============================================================
-- CAREGIVER_CHILDREN — vínculos responsável ↔ criança
-- =============================================================
INSERT INTO caregiver_children (caregiver_id, child_id) VALUES
-- Maria é mãe de Ana Luiza
('cg000001-0000-0000-0000-000000000001', 'child-0001-0000-0000-000000000001'),
-- Ricardo é pai de Pedro Henrique
('cg000002-0000-0000-0000-000000000002', 'child-0002-0000-0000-000000000002'),
-- Dra. Beatriz atende Ana Luiza e Sofia
('cg000003-0000-0000-0000-000000000003', 'child-0001-0000-0000-000000000001'),
('cg000003-0000-0000-0000-000000000003', 'child-0003-0000-0000-000000000003'),
-- Fernanda é mãe de Sofia
('cg000004-0000-0000-0000-000000000004', 'child-0003-0000-0000-000000000003');

-- =============================================================
-- THERAPEUTIC_PROFILES — perfil clínico de cada criança
-- =============================================================
INSERT INTO therapeutic_profiles
  (id, child_id, conditions, interests, sensory_sensitivities,
   main_difficulties, ideal_session_minutes, support_level, engagement_style, therapeutic_notes)
VALUES
(
  'tp000001-0000-0000-0000-000000000001',
  'child-0001-0000-0000-000000000001',
  '["TEA nível 2"]',
  '["animais", "cores vibrantes", "histórias com personagens"]',
  '["sons altos", "texturas ásperas", "multidões"]',
  '["flexibilidade cognitiva", "transições entre atividades", "comunicação expressiva"]',
  15,
  'moderate',
  'visual',
  'Responde bem a rotinas previsíveis e reforço positivo imediato. Evitar mudanças sem aviso prévio.'
),
(
  'tp000002-0000-0000-0000-000000000002',
  'child-0002-0000-0000-000000000002',
  '["TDAH tipo combinado"]',
  '["jogos de ação rápida", "robótica", "futebol", "desafios cronometrados"]',
  '["ambientes silenciosos prolongados", "tarefas longas sem pausa"]',
  '["sustentação da atenção", "controle de impulsividade", "organização sequencial"]',
  20,
  'minimal',
  'kinesthetic',
  'Motivado por desafios com tempo limitado. Pausas de 2 minutos a cada 10 melhoram muito o desempenho.'
),
(
  'tp000003-0000-0000-0000-000000000003',
  'child-0003-0000-0000-000000000003',
  '["TEA nível 1", "DI leve"]',
  '["flores e natureza", "músicas infantis", "pintura com dedos", "animais domésticos"]',
  '["barulhos inesperados", "contato físico não solicitado"]',
  '["comunicação verbal", "interação social", "compreensão de regras complexas"]',
  10,
  'full',
  'visual',
  'Agenda visual diária é essencial. Comunicação por figuras e gestos. Reforço imediato a cada etapa concluída.'
);

-- =============================================================
-- THERAPEUTIC_GOALS — metas terapêuticas por habilidade
-- =============================================================
INSERT INTO therapeutic_goals
  (id, child_id, skill, description, target_value, current_value, unit, active)
VALUES
-- Ana Luiza
(
  'goal0001-0000-0000-0000-000000000001',
  'child-0001-0000-0000-000000000001',
  'sequencing',
  'Completar sequência de 5 etapas da rotina matinal sem ajuda verbal',
  5, 4, 'etapas', TRUE
),
(
  'goal0002-0000-0000-0000-000000000002',
  'child-0001-0000-0000-000000000001',
  'attention',
  'Manter foco em atividade guiada por pelo menos 10 minutos consecutivos',
  10, 7, 'minutos', TRUE
),
(
  'goal0003-0000-0000-0000-000000000003',
  'child-0001-0000-0000-000000000001',
  'routine_execution',
  'Completar rotina matinal sem lembretes por 5 dias seguidos',
  5, 5, 'dias seguidos', FALSE
),
-- Pedro Henrique
(
  'goal0004-0000-0000-0000-000000000004',
  'child-0002-0000-0000-000000000002',
  'memory',
  'Completar jogo de memória de 12 pares em menos de 10 tentativas',
  10, 8, 'tentativas', TRUE
),
(
  'goal0005-0000-0000-0000-000000000005',
  'child-0002-0000-0000-000000000002',
  'impulse_control',
  'Reduzir cliques impulsivos errados para menos de 3 por sessão',
  3, 5, 'erros por sessão', TRUE
),
(
  'goal0006-0000-0000-0000-000000000006',
  'child-0002-0000-0000-000000000002',
  'focus',
  'Concluir caça-figura sem abandonar antes do tempo em 3 sessões seguidas',
  3, 2, 'sessões consecutivas', TRUE
),
-- Sofia
(
  'goal0007-0000-0000-0000-000000000007',
  'child-0003-0000-0000-000000000003',
  'communication',
  'Nomear corretamente 6 emoções básicas ao ver as figuras',
  6, 3, 'emoções identificadas', TRUE
),
(
  'goal0008-0000-0000-0000-000000000008',
  'child-0003-0000-0000-000000000003',
  'social_interaction',
  'Aguardar sua vez em jogo de turnos por 3 rodadas sem interromper',
  3, 1, 'rodadas', TRUE
);

-- =============================================================
-- GAME_SESSIONS — histórico de sessões dos últimos 30 dias
-- =============================================================
INSERT INTO game_sessions
  (id, child_id, activity_code, started_at, ended_at, duration_seconds, success, meta)
VALUES
-- Ana Luiza — sequência de rotina (evolução ao longo do tempo)
(
  'sess0001-0000-0000-0000-000000000001',
  'child-0001-0000-0000-000000000001',
  'sequence_routine',
  '2026-04-28 14:00:00', '2026-04-28 14:08:00', 480, FALSE,
  '{"steps_completed": 2, "total_steps": 4, "difficulty": "easy"}'
),
(
  'sess0002-0000-0000-0000-000000000002',
  'child-0001-0000-0000-000000000001',
  'sequence_routine',
  '2026-05-02 14:30:00', '2026-05-02 14:37:00', 420, TRUE,
  '{"steps_completed": 4, "total_steps": 4, "difficulty": "easy"}'
),
(
  'sess0003-0000-0000-0000-000000000003',
  'child-0001-0000-0000-000000000001',
  'find_object',
  '2026-05-07 15:00:00', '2026-05-07 15:06:00', 360, TRUE,
  '{"hits": 3, "misses": 2, "difficulty": "easy"}'
),
(
  'sess0004-0000-0000-0000-000000000004',
  'child-0001-0000-0000-000000000001',
  'sequence_routine',
  '2026-05-12 14:00:00', '2026-05-12 14:06:00', 360, TRUE,
  '{"steps_completed": 4, "total_steps": 4, "difficulty": "medium"}'
),
(
  'sess0005-0000-0000-0000-000000000005',
  'child-0001-0000-0000-000000000001',
  'memory_cards',
  '2026-05-19 14:00:00', '2026-05-19 14:10:00', 600, FALSE,
  '{"pairs_found": 4, "total_pairs": 6, "attempts": 14, "difficulty": "easy"}'
),
(
  'sess0006-0000-0000-0000-000000000006',
  'child-0001-0000-0000-000000000001',
  'sequence_routine',
  '2026-05-23 14:00:00', '2026-05-23 14:05:00', 300, TRUE,
  '{"steps_completed": 4, "total_steps": 4, "difficulty": "medium"}'
),
-- Pedro Henrique — foco em memória e atenção
(
  'sess0007-0000-0000-0000-000000000007',
  'child-0002-0000-0000-000000000002',
  'memory_cards',
  '2026-04-30 10:00:00', '2026-04-30 10:12:00', 720, FALSE,
  '{"pairs_found": 5, "total_pairs": 6, "attempts": 15, "difficulty": "easy"}'
),
(
  'sess0008-0000-0000-0000-000000000008',
  'child-0002-0000-0000-000000000002',
  'find_object',
  '2026-05-05 10:30:00', '2026-05-05 10:36:00', 360, TRUE,
  '{"hits": 3, "misses": 4, "difficulty": "easy"}'
),
(
  'sess0009-0000-0000-0000-000000000009',
  'child-0002-0000-0000-000000000002',
  'memory_cards',
  '2026-05-10 10:00:00', '2026-05-10 10:10:00', 600, TRUE,
  '{"pairs_found": 6, "total_pairs": 6, "attempts": 9, "difficulty": "easy"}'
),
(
  'sess0010-0000-0000-0000-000000000010',
  'child-0002-0000-0000-000000000002',
  'find_object',
  '2026-05-15 10:00:00', '2026-05-15 10:07:00', 420, TRUE,
  '{"hits": 3, "misses": 2, "difficulty": "medium"}'
),
(
  'sess0011-0000-0000-0000-000000000011',
  'child-0002-0000-0000-000000000002',
  'memory_cards',
  '2026-05-22 10:00:00', '2026-05-22 10:08:00', 480, TRUE,
  '{"pairs_found": 6, "total_pairs": 6, "attempts": 8, "difficulty": "medium"}'
),
-- Sofia — regulação e comunicação
(
  'sess0012-0000-0000-0000-000000000012',
  'child-0003-0000-0000-000000000003',
  'sequence_routine',
  '2026-05-06 09:00:00', '2026-05-06 09:08:00', 480, FALSE,
  '{"steps_completed": 2, "total_steps": 3, "difficulty": "easy"}'
),
(
  'sess0013-0000-0000-0000-000000000013',
  'child-0003-0000-0000-000000000003',
  'sequence_routine',
  '2026-05-13 09:00:00', '2026-05-13 09:07:00', 420, TRUE,
  '{"steps_completed": 3, "total_steps": 3, "difficulty": "easy"}'
),
(
  'sess0014-0000-0000-0000-000000000014',
  'child-0003-0000-0000-000000000003',
  'find_object',
  '2026-05-20 09:30:00', '2026-05-20 09:36:00', 360, TRUE,
  '{"hits": 2, "misses": 3, "difficulty": "easy"}'
);

-- =============================================================
-- SESSION_OBSERVATIONS — observações registradas pelos responsáveis
-- =============================================================
INSERT INTO session_observations
  (id, session_id, child_id, activity_code,
   needed_help, focus_level, frustration_level, engagement_level, notes)
VALUES
(
  'obs00001-0000-0000-0000-000000000001',
  'sess0001-0000-0000-0000-000000000001',
  'child-0001-0000-0000-000000000001',
  'sequence_routine',
  TRUE, 2, 4, 2,
  'Ana ficou confusa na etapa de vestir a mochila. Precisou de ajuda verbal em 2 passos. Frustrou-se no final mas não desistiu.'
),
(
  'obs00002-0000-0000-0000-000000000002',
  'sess0002-0000-0000-0000-000000000002',
  'child-0001-0000-0000-000000000001',
  'sequence_routine',
  FALSE, 4, 1, 5,
  'Completou com entusiasmo! Pediu para jogar novamente. Grande avanço em relação à sessão anterior.'
),
(
  'obs00003-0000-0000-0000-000000000003',
  'sess0003-0000-0000-0000-000000000003',
  'child-0001-0000-0000-000000000001',
  'find_object',
  TRUE, 3, 3, 3,
  'Ficou dispersa no meio da atividade. Precisou de pausa de 2 minutos. Retomou bem após a pausa.'
),
(
  'obs00004-0000-0000-0000-000000000004',
  'sess0004-0000-0000-0000-000000000004',
  'child-0001-0000-0000-000000000001',
  'sequence_routine',
  FALSE, 5, 1, 5,
  'Excelente desempenho no nível médio. Lembrou de todos os passos sem hesitar. Recomendo avançar para nível difícil.'
),
(
  'obs00005-0000-0000-0000-000000000005',
  'sess0005-0000-0000-0000-000000000005',
  'child-0001-0000-0000-000000000001',
  'memory_cards',
  TRUE, 3, 4, 2,
  'Memória de cartas foi desafiadora. Sinais de frustração depois de 8 tentativas. Sessão interrompida brevemente.'
),
(
  'obs00006-0000-0000-0000-000000000006',
  'sess0007-0000-0000-0000-000000000007',
  'child-0002-0000-0000-000000000002',
  'memory_cards',
  TRUE, 3, 3, 4,
  'Pedro quase completou, mas impacientou nas últimas 3 cartas. Dica visual ajudou. Muito motivado a tentar de novo.'
),
(
  'obs00007-0000-0000-0000-000000000007',
  'sess0009-0000-0000-0000-000000000009',
  'child-0002-0000-0000-000000000002',
  'memory_cards',
  FALSE, 5, 1, 5,
  'Concentração excelente! Completou em 9 tentativas — meta quase batida (meta: 10). Evolução notável em 2 semanas.'
),
(
  'obs00008-0000-0000-0000-000000000008',
  'sess0011-0000-0000-0000-000000000011',
  'child-0002-0000-0000-000000000002',
  'memory_cards',
  FALSE, 5, 1, 5,
  'Meta batida: 8 tentativas no nível médio! Pedro vibrou muito ao terminar. Sugerido avançar para nível difícil.'
),
(
  'obs00009-0000-0000-0000-000000000009',
  'sess0012-0000-0000-0000-000000000012',
  'child-0003-0000-0000-000000000003',
  'sequence_routine',
  TRUE, 2, 3, 3,
  'Sofia precisou de apoio em todas as etapas. Usamos imagens como suporte. Boa receptividade à agenda visual.'
),
(
  'obs00010-0000-0000-0000-000000000010',
  'sess0013-0000-0000-0000-000000000013',
  'child-0003-0000-0000-000000000003',
  'sequence_routine',
  FALSE, 4, 1, 4,
  'Completou as 3 etapas sozinha! Demonstrou orgulho ao terminar. Avanço significativo em relação à semana passada.'
);

-- =============================================================
-- WEEKLY_PLANS — plano semanal de cada criança
-- =============================================================
INSERT INTO weekly_plans (id, child_id) VALUES
('wplan001-0000-0000-0000-000000000001', 'child-0001-0000-0000-000000000001'),
('wplan002-0000-0000-0000-000000000002', 'child-0002-0000-0000-000000000002'),
('wplan003-0000-0000-0000-000000000003', 'child-0003-0000-0000-000000000003');

INSERT INTO weekly_plan_entries (id, plan_id, day, activity_code) VALUES
-- Ana Luiza: sequência + caça-figura + memória
('wpe00001-0000-0000-0000-000000000001', 'wplan001-0000-0000-0000-000000000001', 'monday',    'sequence_routine'),
('wpe00002-0000-0000-0000-000000000002', 'wplan001-0000-0000-0000-000000000001', 'wednesday', 'find_object'),
('wpe00003-0000-0000-0000-000000000003', 'wplan001-0000-0000-0000-000000000001', 'friday',    'memory_cards'),
-- Pedro Henrique: memória + caça-figura
('wpe00004-0000-0000-0000-000000000004', 'wplan002-0000-0000-0000-000000000002', 'tuesday',   'memory_cards'),
('wpe00005-0000-0000-0000-000000000005', 'wplan002-0000-0000-0000-000000000002', 'thursday',  'find_object'),
('wpe00006-0000-0000-0000-000000000006', 'wplan002-0000-0000-0000-000000000002', 'saturday',  'memory_cards'),
-- Sofia: sequência + caça-figura
('wpe00007-0000-0000-0000-000000000007', 'wplan003-0000-0000-0000-000000000003', 'monday',    'sequence_routine'),
('wpe00008-0000-0000-0000-000000000008', 'wplan003-0000-0000-0000-000000000003', 'wednesday', 'find_object');

-- =============================================================
-- ADAPTIVE_PROFILES — nível de dificuldade adaptativo por jogo
-- =============================================================
INSERT INTO adaptive_profiles (child_id, game_code, current_level, sessions_at_level) VALUES
-- Ana Luiza
('child-0001-0000-0000-000000000001', 'sequence_routine', 'medium', 3),
('child-0001-0000-0000-000000000001', 'find_object',      'easy',   1),
('child-0001-0000-0000-000000000001', 'memory_cards',     'easy',   1),
-- Pedro Henrique
('child-0002-0000-0000-000000000002', 'memory_cards',     'medium', 2),
('child-0002-0000-0000-000000000002', 'find_object',      'medium', 1),
-- Sofia
('child-0003-0000-0000-000000000003', 'sequence_routine', 'easy',   2),
('child-0003-0000-0000-000000000003', 'find_object',      'easy',   1);
