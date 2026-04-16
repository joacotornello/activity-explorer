import express, { type Express } from 'express';

import notes from './data/notes.json';
import { createMetaRoute } from './api/routes/metaRoute';
import { createNotesRoute } from './api/routes/notesRoute';
import type { StickyNote } from '../src/entities/note/model/types';

export const createApp = (): Express => {
  const app = express();
  const seededNotes = notes as StickyNote[];

  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.use('/api/meta', createMetaRoute(seededNotes));
  app.use('/api/notes', createNotesRoute(seededNotes));

  return app;
};
