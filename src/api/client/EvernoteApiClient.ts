import { APIRequestContext, expect } from '@playwright/test';
import { NoteObject } from '../../models/ApiTypes';

export class EvernoteApiClient {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async verifyNoteExistsInBackend(title: string): Promise<boolean> {
    const response = await this.request.get(`/api/notes?title=${encodeURIComponent(title)}`);
    if (!response.ok()) {
      return false;
    }
    const notes: NoteObject[] = await response.json();
    return notes.some(note => note.title === title);
  }

  async deleteNote(guid: string): Promise<void> {
    const response = await this.request.delete(`/api/notes/${guid}`);
    expect([200, 204]).toContain(response.status());
  }
}
