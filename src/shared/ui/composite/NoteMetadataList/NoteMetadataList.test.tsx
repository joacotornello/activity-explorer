import { render, screen, within } from '@testing-library/react';

import { NoteMetadataList } from './NoteMetadataList';

describe('NoteMetadataList', () => {
  it('maps note metadata into labeled detail rows', () => {
    render(
      <NoteMetadataList
        note={{
          author: {
            id: 'author-1',
            name: 'Sarah Chen',
          },
          color: 'green',
          createdAt: '2026-04-15T12:00:00.000Z',
          id: 'note-1',
          text: 'Seed note',
        }}
      />,
    );

    const authorItem = screen.getByText('Author').closest('.ui-metadata-item');
    const colorItem = screen.getByText('Color').closest('.ui-metadata-item');
    const createdItem = screen.getByText('Created').closest('.ui-metadata-item');

    if (authorItem === null || colorItem === null || createdItem === null) {
      throw new Error('Expected metadata items to render.');
    }

    expect(within(authorItem as HTMLElement).getByText('Sarah Chen')).toBeInTheDocument();
    expect(within(colorItem as HTMLElement).getByText('Green')).toBeInTheDocument();
    expect(
      within(createdItem as HTMLElement).getByText(/Apr 15,/i),
    ).toBeInTheDocument();
  });
});
