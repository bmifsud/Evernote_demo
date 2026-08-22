import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL || 'https://www.evernote.com',
  user: process.env.EVERNOTE_USER || '',
  password: process.env.EVERNOTE_PASSWORD || '',
  validEmail: process.env.EVERNOTE_VALID_EMAIL || '',
  validPassword: process.env.EVERNOTE_VALID_PASSWORD || '',
};
