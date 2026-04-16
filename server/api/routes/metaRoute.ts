import { Router } from 'express';

import type { StickyNote } from '../../../src/entities/note/model/types';
import { getMeta } from '../../domain/notes/getMeta';

export const createMetaRoute = (notes: StickyNote[]): Router => {
  const router = Router();

  router.get('/', (_request, response) => {
    response.status(200).json(getMeta(notes));
  });

  return router;
};
