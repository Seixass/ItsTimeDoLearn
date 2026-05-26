import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';

const BASE = 'http://localhost:5173';
const SS_DIR = 'test-screenshots';
if (!existsSync(SS_DIR)) mkdirSync(SS_DIR);

let browser, page;
let passed = 0, failed = 0;

async function shot(name) {
  await page.screenshot({ path: `${SS_DIR}/${name}.png`, fullPage: true });
}

function pass(label) { console.log(`  ✅ ${label}`); passed++; }
function fail(label, err) { console.log(`  ❌ ${label}: ${err?.message ?? err}`); failed++; }

async function check(label, fn) {
  try { await fn(); pass(label); }
  catch (e) { fail(label, e); }
}

async function noErrorBoundary() {
  const hasError = await page.locator('text=Algo deu errado').isVisible().catch(() => false);
  if (hasError) throw new Error('ErrorBoundary visível na página');
}

// ─────────────────────────────────────────────
browser = await chromium.launch({ headless: false, slowMo: 80 });
page = await browser.newPage();
page.on('pageerror', err => console.log(`    [pageerror] ${err.message}`));
// ─────────────────────────────────────────────

console.log('\n=== ItsTimeDoLearn — Testes E2E (Sidebar Architecture) ===\n');

// ── 1. HOME PAGE ────────────────────────────────────────────────────
console.log('1. Home page');
await page.goto(BASE);
await page.waitForLoadState('networkidle');
await shot('01-home');

await check('Título presente', async () => {
  await page.waitForSelector('text=Its Time Do', { timeout: 5000 });
});
await check('Botão "Escolher jogador" visível', async () => {
  await page.waitForSelector('text=Escolher jogador', { timeout: 3000 });
});
await check('Grid de crianças visível (Ana Luiza, Pedro Henrique)', async () => {
  await page.waitForSelector('text=Ana Luiza', { timeout: 3000 });
  await page.waitForSelector('text=Pedro Henrique', { timeout: 3000 });
});
await check('Sem ErrorBoundary', noErrorBoundary);

// ── 2. SELECIONAR CRIANÇA → ÁREA DA CRIANÇA ──────────────────────────
console.log('\n2. Selecionar criança → Área da Criança');
await page.click('text=Ana Luiza');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);
await shot('02-child-hub-ana');

await check('Sem ErrorBoundary (bug do loop infinito)', noErrorBoundary);
await check('Nome da criança no header', async () => {
  await page.waitForSelector('.pib-name', { timeout: 4000 });
  const name = await page.locator('.pib-name').first().innerText();
  if (!name.includes('Ana')) throw new Error(`Nome incorreto: ${name}`);
});
await check('Seção de jogos visível', async () => {
  await page.waitForSelector('text=Missões disponíveis', { timeout: 3000 });
});
await check('3 jogos renderizados', async () => {
  const cards = page.locator('.game-mission-card');
  const count = await cards.count();
  if (count !== 3) throw new Error(`Esperado 3 jogos, encontrado ${count}`);
});
await check('Barra de XP (Ana tem sessões)', async () => {
  await page.waitForSelector('.xp-bar-wrap', { timeout: 3000 });
});

// ── 3. SIDEBAR DA CRIANÇA ────────────────────────────────────────────
console.log('\n3. Sidebar da criança');
await check('Item Jornada visível na sidebar', async () => {
  await page.waitForSelector('text=Jornada', { timeout: 3000 });
});
await check('Item Responsável visível na sidebar', async () => {
  await page.waitForSelector('text=Responsável', { timeout: 3000 });
});
await check('Logo ItsTimeDoLearn na sidebar', async () => {
  await page.waitForSelector('.child-sidebar-brand', { timeout: 3000 });
});

// ── 4. ÁREA DO RESPONSÁVEL — VISÃO GERAL ─────────────────────────────
console.log('\n4. Área do Responsável — Visão Geral');
await page.click('text=Responsável');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);
await shot('04-caregiver-overview');

await check('Sem ErrorBoundary no painel do responsável', noErrorBoundary);
await check('Título Painel do responsável', async () => {
  await page.waitForSelector('text=Painel do responsável', { timeout: 4000 });
});
await check('Métricas visíveis (Visão geral)', async () => {
  await page.waitForSelector('text=Visão geral', { timeout: 3000 });
});
await check('Sidebar do responsável visível', async () => {
  await page.waitForSelector('.caregiver-sidebar', { timeout: 3000 });
});
await check('Histórico de atividades', async () => {
  await page.waitForSelector('text=Histórico de atividades', { timeout: 3000 });
});

// ── 5. PERFIL TERAPÊUTICO — EDIÇÃO ───────────────────────────────────
console.log('\n5. Perfil Terapêutico — edição');
await page.click('text=Perfil');
await page.waitForTimeout(500);
await shot('05-profile');

await check('Sem ErrorBoundary no perfil', noErrorBoundary);
await check('Seção perfil terapêutico visível', async () => {
  await page.waitForSelector('text=Perfil terapêutico', { timeout: 3000 });
});
await check('Botão Editar visível', async () => {
  const editBtn = page.locator('button', { hasText: 'Editar' }).first();
  await editBtn.waitFor({ timeout: 3000 });
});

const editBtn = page.locator('button', { hasText: 'Editar' }).first();
await editBtn.click();
await page.waitForTimeout(400);
await shot('05b-profile-edit');

await check('Formulário de edição abriu', async () => {
  await page.waitForSelector('text=Condições (separadas por vírgula)', { timeout: 3000 });
});
await check('Salvar perfil funciona', async () => {
  await page.click('button:text("Salvar")');
  await page.waitForSelector('text=Perfil terapêutico', { timeout: 3000 });
  const form = await page.locator('text=Condições (separadas por vírgula)').isVisible().catch(() => false);
  if (form) throw new Error('Formulário ainda visível após Salvar');
});

// ── 6. METAS TERAPÊUTICAS ────────────────────────────────────────────
console.log('\n6. Metas terapêuticas');
await page.click('text=Metas');
await page.waitForTimeout(400);
await shot('06-goals');

await check('Sem ErrorBoundary nas metas', noErrorBoundary);
await check('Seção de metas visível', async () => {
  await page.waitForSelector('text=Metas terapêuticas', { timeout: 3000 });
});
await check('Meta ativa renderizada', async () => {
  await page.waitForSelector('.goal-card', { timeout: 3000 });
});
await check('Botão de atualizar progresso visível', async () => {
  const pencil = page.locator('button[title="Atualizar progresso"]').first();
  await pencil.waitFor({ timeout: 3000 });
});

await check('Abrir e fechar edição de progresso', async () => {
  const pencil = page.locator('button[title="Atualizar progresso"]').first();
  await pencil.click();
  await page.waitForSelector('input[type=number]', { timeout: 2000 });
  await page.keyboard.press('Escape');
  await page.click('button:text("✕")').catch(() => {});
});

// ── 7. PLANO SEMANAL ────────────────────────────────────────────────
console.log('\n7. Plano Semanal');
await page.click('text=Plano Semanal');
await page.waitForTimeout(400);
await shot('07-weekly-plan');

await check('Sem ErrorBoundary no plano semanal', noErrorBoundary);
await check('Plano semanal visível', async () => {
  await page.waitForSelector('text=Plano semanal', { timeout: 3000 });
});
await check('Grade de dias visível (Ana tem plano)', async () => {
  await page.waitForSelector('.weekly-plan-grid', { timeout: 3000 });
});

// ── 8. VOLTAR PARA ÁREA DA CRIANÇA ───────────────────────────────────
console.log('\n8. Voltar para Área da Criança');
await page.click('text=Área da Criança');
await page.waitForTimeout(600);
await shot('08-child-hub-back');

await check('Sem ErrorBoundary ao voltar', noErrorBoundary);
await check('Child hub recarregado', async () => {
  await page.waitForSelector('text=Missões disponíveis', { timeout: 4000 });
});

// ── 9. JOGAR UM JOGO ────────────────────────────────────────────────
console.log('\n9. Jogar jogo — Sequência de Rotina');
const playBtn = page.locator('.game-mission-card').first().locator('button', { hasText: 'Jogar' });
await playBtn.click();
await page.waitForLoadState('networkidle');
await page.waitForTimeout(600);
await shot('09-game-sequence');

await check('Sem ErrorBoundary na tela de jogo', noErrorBoundary);
await check('Título do jogo visível', async () => {
  await page.waitForSelector('text=Sequência de Rotina', { timeout: 4000 });
});
await check('Passos do jogo renderizados', async () => {
  await page.waitForSelector('.sequence-step', { timeout: 3000 });
  const steps = await page.locator('.sequence-step').count();
  if (steps === 0) throw new Error('Nenhum passo renderizado');
});

const steps = await page.locator('.sequence-step').all();
for (const step of steps) {
  await step.click();
  await page.waitForTimeout(200);
}
await page.waitForTimeout(1500);
await shot('09b-game-complete');

await check('Tela de observação aparece após completar', async () => {
  await page.waitForSelector('text=Observação da sessão', { timeout: 5000 });
});
await check('Pular observação funciona', async () => {
  await page.click('button:text("Pular")');
  await page.waitForSelector('text=Incrível', { timeout: 4000 });
});
await shot('09c-game-result');
await check('Tela de resultado visível', async () => {
  await page.waitForSelector('text=Sessão salva', { timeout: 3000 });
});
await check('Botão Voltar ao hub', async () => {
  await page.waitForSelector('text=Voltar ao hub', { timeout: 2000 });
});
await page.click('text=Voltar ao hub');
await page.waitForTimeout(600);

// ── 10. JORNADA ────────────────────────────────────────────────────
console.log('\n10. Jornada');
await page.click('text=Jornada');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(600);
await shot('10-trail');

await check('Sem ErrorBoundary na Jornada', noErrorBoundary);
await check('Fases da trilha visíveis', async () => {
  await page.waitForSelector('.trail-phase', { timeout: 4000 });
});
await check('Conquistas visíveis', async () => {
  await page.waitForSelector('text=Conquistas', { timeout: 3000 });
});
await page.click('text=← Voltar');
await page.waitForTimeout(400);

// ── 11. CRIAR NOVA CRIANÇA (offline) ────────────────────────────────
console.log('\n11. Criar nova criança (backend offline)');
await page.click('text=Início');
await page.waitForTimeout(400);
await page.waitForSelector('.player-card--add', { timeout: 3000 });
await page.click('.player-card--add');
await page.waitForTimeout(300);
await shot('11-form-create');

await check('Formulário de criação abriu', async () => {
  await page.waitForSelector('text=Novo jogador', { timeout: 3000 });
});
await page.fill('input[placeholder="Nome da criança"]', 'Criança Teste');
await page.fill('input[type=date]', '2019-05-10');
await check('Salvar funciona sem backend', async () => {
  await page.click('button:text("Salvar jogador")');
  await page.waitForURL('**/children/**', { timeout: 5000 });
});
await page.waitForTimeout(800);
await shot('11b-new-child-dashboard');
await check('Sem ErrorBoundary após criar criança', noErrorBoundary);
await check('Dashboard da nova criança carregou', async () => {
  await page.waitForSelector('text=Criança Teste', { timeout: 4000 });
});

// ── 12. MEMÓRIA CARDS ───────────────────────────────────────────────
console.log('\n12. Jogo Memória de Cartas');
const url = page.url();
const id = url.split('/children/')[1]?.split('/')[0];
await page.goto(`${BASE}/children/${id}/play/memory_cards`);
await page.waitForTimeout(600);
await shot('12-memory');

await check('Sem ErrorBoundary no Memória', noErrorBoundary);
await check('Grade de cartas renderizada', async () => {
  await page.waitForSelector('.memory-card', { timeout: 4000 });
  const cards = await page.locator('.memory-card').count();
  if (cards === 0) throw new Error('Nenhuma carta');
});

// ── 13. CAÇA-FIGURA ─────────────────────────────────────────────────
console.log('\n13. Jogo Caça-Figura');
await page.goto(`${BASE}/children/${id}/play/find_object`);
await page.waitForTimeout(600);
await shot('13-find-object');

await check('Sem ErrorBoundary no Caça-Figura', noErrorBoundary);
await check('Grade de objetos renderizada', async () => {
  await page.waitForSelector('.find-object-cell', { timeout: 4000 });
});

// ── 14. SEGUNDO JOGADOR (Pedro) ─────────────────────────────────────
console.log('\n14. Selecionar segundo jogador (Pedro)');
await page.goto(BASE);
await page.waitForTimeout(400);
await page.click('text=Pedro Henrique');
await page.waitForTimeout(800);
await shot('14-pedro-dashboard');

await check('Sem ErrorBoundary para Pedro', noErrorBoundary);
await check('Dashboard do Pedro carregou', async () => {
  await page.waitForSelector('text=Pedro Henrique', { timeout: 4000 });
});

// ── 15. ATIVIDADE GUIADA ────────────────────────────────────────────
console.log('\n15. Atividade Guiada');
const pedroId = page.url().split('/children/')[1]?.split('/')[0];
await page.goto(`${BASE}/children/${pedroId}/activity/breathing_exercise`);
await page.waitForTimeout(600);
await shot('15-guided-activity');

await check('Sem ErrorBoundary na atividade guiada', noErrorBoundary);
await check('Intro da atividade visível', async () => {
  await page.waitForSelector('text=Iniciar atividade', { timeout: 4000 });
});

// ── 16. REFERÊNCIAS ─────────────────────────────────────────────────
console.log('\n16. Página de Referências');
await page.goto(`${BASE}/references`);
await page.waitForTimeout(500);
await shot('16-references');

await check('Sem ErrorBoundary nas Referências', noErrorBoundary);
await check('Conteúdo de referências carregou', async () => {
  await page.waitForSelector('h1', { timeout: 3000 });
});

// ─────────────────────────────────────────────
await browser.close();

console.log(`\n${'─'.repeat(40)}`);
console.log(`✅ Passaram: ${passed}   ❌ Falharam: ${failed}`);
console.log(`Screenshots salvas em: ${SS_DIR}/`);
if (failed > 0) process.exit(1);
