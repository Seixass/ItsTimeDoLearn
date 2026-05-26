import type { Activity } from '../activities/activities.types';

export type RecommendationPriority = 'high' | 'medium' | 'low';

export interface Recommendation {
  activity: Activity;
  priority: RecommendationPriority;
  reason: string;
}

export interface RecommendationsResponse {
  childId: string;
  childAge: number | null;
  totalFound: number;
  recommendations: Recommendation[];
  generatedAt: string;
}
