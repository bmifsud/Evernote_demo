import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL || 'https://www.evernote.com',
  user: process.env.EVERNOTE_USER || '',
  password: process.env.EVERNOTE_PASSWORD || '',
};
