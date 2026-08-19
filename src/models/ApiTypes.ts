export interface AuthPayload {
  username?: string;
  password?: string;
  token?: string;
  [key: string]: unknown;
}

export interface NoteObject {
  guid: string;
  title: string;
  content?: string;
  created?: number;
  updated?: number;
  [key: string]: unknown;
}
