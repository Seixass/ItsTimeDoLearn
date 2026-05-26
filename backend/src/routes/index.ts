import { Router } from 'express';
import { childrenRouter } from '../modules/children/children.routes';
import { activitiesRouter } from '../modules/activities/activities.routes';
import { recommendationsRouter } from '../modules/recommendations/recommendations.routes';
import { sessionsRouter } from '../modules/sessions/sessions.routes';
import { goalsRouter } from '../modules/goals/goals.routes';
import { observationsRouter } from '../modules/observations/observations.routes';
import { weeklyPlansRouter } from '../modules/weekly_plans/weekly_plans.routes';
import { adaptiveProfilesRouter } from '../modules/adaptive_profiles/adaptive_profiles.routes';
import { caregiversRouter } from '../modules/caregivers/caregivers.routes';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.3.0',
    },
  });
});

router.use('/children',          childrenRouter);
router.use('/activities',        activitiesRouter);
router.use('/recommendations',   recommendationsRouter);
router.use('/sessions',          sessionsRouter);
router.use('/goals',             goalsRouter);
router.use('/observations',      observationsRouter);
router.use('/weekly-plans',      weeklyPlansRouter);
router.use('/adaptive-profiles', adaptiveProfilesRouter);
router.use('/caregivers',        caregiversRouter);
