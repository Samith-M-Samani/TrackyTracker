export type LogType = 'text' | 'media' | 'mixed';

export interface LogEntry {
  id: string;
  title: string;
  content?: string;
  mediaUrls?: string[];
  type: LogType;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
}
