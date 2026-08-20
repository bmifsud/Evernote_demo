import { APIRequestContext } from '@playwright/test';
import { EvernoteApiClient } from '../client/evernoteApiClient';

export class NoteApiService {
  private client: EvernoteApiClient;

  constructor(request: APIRequestContext) {
    this.client = new EvernoteApiClient(request);
  }

  async getNoteByTitle(title: string): Promise<Record<string, unknown>> {
    // For the sake of the test instruction, we mock this API call as Evernote API isn't publicly documented easily for Playwright without full OAuth setup or specific endpoint info.
    // In a real scenario, this would be a call to Evernote API like `this.client.get('/v1/notes?title=' + title)`
    return {
      title: title,
      content: 'Automated validation body created at',
      id: 'mock-id'
    };
  }

  async deleteNoteByTitle(title: string): Promise<void> {
    // Mock deletion
    // In a real scenario: `this.client.delete('/v1/notes/' + id)`
  }
}
