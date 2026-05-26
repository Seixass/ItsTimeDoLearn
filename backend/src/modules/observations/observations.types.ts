export type ObservationLevel = 1 | 2 | 3 | 4 | 5;

export interface SessionObservation {
  id: string;
  sessionId: string;
  childId: string;
  gameCode: string;
  neededHelp: boolean;
  focusLevel: ObservationLevel;
  frustrationLevel: ObservationLevel;
  engagementLevel: ObservationLevel;
  notes: string;
  recordedAt: string;
}

export interface CreateObservationDto {
  sessionId: string;
  childId: string;
  gameCode: string;
  neededHelp: boolean;
  focusLevel: ObservationLevel;
  frustrationLevel: ObservationLevel;
  engagementLevel: ObservationLevel;
  notes: string;
}
