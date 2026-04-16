import request from 'supertest';

import { createApp } from '../../app';

describe('notes API routes', () => {
  it('returns meta for global filter options and dataset bounds', async () => {
    const response = await request(createApp()).get('/api/meta');

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(60);
    expect(response.body.authors).toHaveLength(6);
    expect(response.body.colors).toEqual([
      { id: 'blue', label: 'Blue' },
      { id: 'green', label: 'Green' },
      { id: 'purple', label: 'Purple' },
      { id: 'red', label: 'Red' },
      { id: 'yellow', label: 'Yellow' },
    ]);
    expect(response.body.timeBounds).toEqual({
      min: '2026-03-11T23:00:00.000Z',
      max: '2026-04-15T18:00:00.000Z',
    });
  });

  it('returns paginated notes with filtered total counts', async () => {
    const firstPage = await request(createApp())
      .get('/api/notes')
      .query({ limit: '5', authors: 'user_1' });

    expect(firstPage.status).toBe(200);
    expect(firstPage.body.total).toBe(10);
    expect(firstPage.body.items).toHaveLength(5);
    expect(firstPage.body.hasMore).toBe(true);
    expect(firstPage.body.nextCursor).toEqual(expect.any(String));

    const secondPage = await request(createApp()).get('/api/notes').query({
      limit: '5',
      authors: 'user_1',
      cursor: firstPage.body.nextCursor,
    });

    expect(secondPage.status).toBe(200);
    expect(secondPage.body.total).toBe(10);
    expect(secondPage.body.items).toHaveLength(5);
    expect(secondPage.body.hasMore).toBe(false);

    const firstPageIds = firstPage.body.items.map(
      (note: { id: string }) => note.id,
    );
    const secondPageIds = secondPage.body.items.map(
      (note: { id: string }) => note.id,
    );

    expect(secondPageIds.some((id: string) => firstPageIds.includes(id))).toBe(
      false,
    );
  });

  it('rejects invalid filter values', async () => {
    const response = await request(createApp())
      .get('/api/notes')
      .query({ colors: 'pink' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid colors filter.' });
  });
});
