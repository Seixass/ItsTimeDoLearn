import type { ChildTherapeuticProfile } from '../types';

export const INITIAL_THERAPEUTIC_PROFILES: ChildTherapeuticProfile[] = [
  {
    id: 'tp1',
    childId: '1',
    conditions: ['TEA'],
    interests: ['animais', 'natureza', 'música'],
    sensorySensitivities: ['sons altos', 'multidões', 'luzes intensas'],
    mainDifficulties: ['attention', 'social_interaction', 'emotional_regulation'],
    idealSessionMinutes: 10,
    supportLevel: 'moderate',
    engagementStyle: 'visual',
    therapeuticNotes:
      'Ana demonstra melhor engajamento com atividades visuais e temáticas de animais. ' +
      'Prefere rotinas previsíveis e sinalização antecipada de mudanças. ' +
      'Responde bem a reforço positivo imediato.',
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'tp2',
    childId: '2',
    conditions: ['TDAH'],
    interests: ['figuras coloridas', 'dinossauros', 'jogos de ação'],
    sensorySensitivities: [],
    mainDifficulties: ['impulse_control', 'focus', 'emotional_regulation'],
    idealSessionMinutes: 8,
    supportLevel: 'minimal',
    engagementStyle: 'kinesthetic',
    therapeuticNotes:
      'Pedro se beneficia de atividades curtas com feedback imediato. ' +
      'Engaja muito bem com desafios visuais e dinâmicos. ' +
      'Tende a desorganizar-se em atividades longas sem estrutura clara.',
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];
