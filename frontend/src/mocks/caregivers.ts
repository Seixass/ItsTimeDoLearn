import type { Caregiver } from '../types';

export const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: 'cg1',
    name: 'Maria Silva',
    relation: 'mãe',
    phone: '(11) 99999-0001',
    email: 'maria@email.com',
    linkedChildIds: ['1'],
    monitoringPreferences: ['Receber alertas de progresso', 'Acompanhar metas'],
    notes: 'Disponível para sessões nas tardes de semana.',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'cg2',
    name: 'Carlos Santos',
    relation: 'pai',
    phone: '(11) 99999-0002',
    email: 'carlos@email.com',
    linkedChildIds: ['2'],
    monitoringPreferences: ['Ver histórico de sessões', 'Receber recomendações'],
    notes: 'Prefere relatórios semanais.',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
];
