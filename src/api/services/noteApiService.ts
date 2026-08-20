import { APIRequestContext } from '@playwright/test';
import { EvernoteApiClient } from '../client/evernoteApiClient';

export class NoteApiService {
  private client: EvernoteApiClient;

  constructor(request: APIRequestContext) {
    this.client = new EvernoteApiClient(request);
  }

  async getNoteByTitle(title: string): Promise<Record<string, unknown>> {
    // Cross-validate note persistence using the API
    const response = await this.client.get(`/v1/notes?title=${encodeURIComponent(title)}`);
    if (!response.ok()) {
      throw new Error(`Failed to fetch note by title: ${response.status()} - ${await response.text()}`);
    }
    const data = await response.json();
    // Assuming the API returns a list of notes matching the title
    if (data.notes && data.notes.length > 0) {
      return data.notes[0];
    }
    throw new Error('Note not found');
  }

  async deleteNoteByTitle(title: string): Promise<void> {
    const note = await this.getNoteByTitle(title).catch(() => null);
    if (note && note.id) {
      const response = await this.client.delete(`/v1/notes/${note.id}`);
      if (!response.ok()) {
        throw new Error(`Failed to delete note: ${response.status()} - ${await response.text()}`);
      }
    }
  }
}
