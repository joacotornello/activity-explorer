import { fireEvent, render, screen } from '@testing-library/react';

import type { StickyNote } from '@entities/note/model/types';

import { NoteListItem } from './NoteListItem';

const noteFixture: StickyNote = {
  id: 'note-1',
  text: 'Research cluster surfaced in latest onboarding review.',
  color: 'yellow',
  author: {
    id: 'author-1',
    name: 'Sarah Chen',
  },
  createdAt: '2026-04-15T12:00:00.000Z',
};

describe('NoteListItem', () => {
  it('renders selected state without relying on color alone', () => {
    render(<NoteListItem note={noteFixture} selected={true} onSelect={jest.fn()} />);

    expect(
      screen.getByRole('button', {
        name: /selected note from sarah chen/i,
        pressed: true,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/^Selected$/i)).toHaveLength(2);
    expect(screen.getByText(noteFixture.text)).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName.toLowerCase() === 'time' &&
          element.getAttribute('datetime') === noteFixture.createdAt,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/ago$/i)).not.toBeInTheDocument();
  });

  it('calls onSelect with note id when pressed', () => {
    const onSelect = jest.fn();

    render(<NoteListItem note={noteFixture} selected={false} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith('note-1');
  });

  it('keeps button content as phrasing content for assistive tech', () => {
    render(<NoteListItem note={noteFixture} selected={false} onSelect={jest.fn()} />);

    expect(screen.getByRole('button').querySelector('p')).toBeNull();
  });
});
