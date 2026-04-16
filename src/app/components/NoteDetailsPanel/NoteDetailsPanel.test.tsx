import { fireEvent, render, screen } from '@testing-library/react';

import type { StickyNote } from '@entities/note/model/types';

import { NoteDetailsPanel } from './NoteDetailsPanel';

const noteFixture: StickyNote = {
  author: {
    id: 'author-1',
    name: 'Sarah Chen',
  },
  color: 'yellow',
  createdAt: '2026-04-15T12:00:00.000Z',
  id: 'note-1',
  text: 'Research cluster surfaced in latest onboarding review.',
};

describe('NoteDetailsPanel', () => {
  it('renders selected note details and closes through icon button', () => {
    const onClose = jest.fn();

    render(<NoteDetailsPanel note={noteFixture} onClose={onClose} />);

    expect(screen.getByText(noteFixture.text)).toBeInTheDocument();
    expect(screen.getByText(noteFixture.author.name)).toBeInTheDocument();
    expect(screen.getByText(/^Yellow$/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close note details/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
