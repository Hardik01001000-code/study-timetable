export type Priority = 'High' | 'Medium' | 'Low';

export interface Subject {
  id: string;
  name: string;
  priority: Priority;
}

export interface ScheduledSession {
  date: string; // YYYY-MM-DD
  isCompleted: boolean;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  scheduledSessions: ScheduledSession[];
}
