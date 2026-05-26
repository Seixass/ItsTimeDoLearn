export type CaregiverRelation =
  | 'mãe'
  | 'pai'
  | 'responsável legal'
  | 'terapeuta'
  | 'professor'
  | 'outro';

export interface Caregiver {
  id: string;
  name: string;
  relation: CaregiverRelation;
  phone?: string;
  email?: string;
  linkedChildIds: string[];
  monitoringPreferences: string[];
  notes?: string;
  createdAt: string;
}

export interface CreateCaregiverDto {
  name: string;
  relation: CaregiverRelation;
  phone?: string;
  email?: string;
  linkedChildIds?: string[];
  monitoringPreferences?: string[];
  notes?: string;
}

export interface UpdateCaregiverDto {
  name?: string;
  relation?: CaregiverRelation;
  phone?: string;
  email?: string;
  linkedChildIds?: string[];
  monitoringPreferences?: string[];
  notes?: string;
}
