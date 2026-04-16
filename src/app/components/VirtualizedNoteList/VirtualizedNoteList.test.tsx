import { render, screen, waitFor } from '@testing-library/react';

import type { StickyNote } from '@entities/note/model/types';
import { VirtualizedNoteList } from './VirtualizedNoteList';

const buildNote = (index: number): StickyNote => ({
  author: {
    id: `author-${index}`,
    name: `Author ${index}`,
  },
  color: 'yellow',
  createdAt: `2026-04-${`${index + 1}`.padStart(2, '0')}T12:00:00.000Z`,
  id: `note-${index}`,
  text: `Note body ${index}`,
});

describe('VirtualizedNoteList', () => {
  it('renders visible slice instead of full note collection', () => {
    render(
      <VirtualizedNoteList
        ariaLabel="Notes list"
        hasMore={false}
        hasLoadMoreError={false}
        isLoadingMore={false}
        notes={Array.from({ length: 40 }, (_, index) => buildNote(index))}
        onLoadMore={() => undefined}
        onRetryLoadMore={() => undefined}
        onSelectNote={() => undefined}
        selectedNoteId={null}
      />,
    );

    const renderedNoteButtons = screen.getAllByRole('button');

    expect(renderedNoteButtons.length).toBeLessThan(40);
    expect(screen.getByText('Author 0')).toBeInTheDocument();
    expect(screen.queryByText('Author 39')).not.toBeInTheDocument();
  });

  it('requests next page when rendered window reaches tail of loaded notes', async () => {
    const handleLoadMore = jest.fn();

    render(
      <VirtualizedNoteList
        ariaLabel="Notes list"
        hasMore={true}
        hasLoadMoreError={false}
        isLoadingMore={false}
        notes={Array.from({ length: 6 }, (_, index) => buildNote(index))}
        onLoadMore={handleLoadMore}
        onRetryLoadMore={() => undefined}
        onSelectNote={() => undefined}
        selectedNoteId={null}
      />,
    );

    await waitFor(() => {
      expect(handleLoadMore).toHaveBeenCalledTimes(1);
    });
  });

  it('shows end-of-list copy when all notes loaded', () => {
    render(
      <VirtualizedNoteList
        ariaLabel="Notes list"
        hasMore={false}
        hasLoadMoreError={false}
        isLoadingMore={false}
        notes={[]}
        onLoadMore={() => undefined}
        onRetryLoadMore={() => undefined}
        onSelectNote={() => undefined}
        selectedNoteId={null}
      />,
    );

    const endCopy = screen.getByText(/reached the end/i);

    expect(endCopy).toBeInTheDocument();
    expect(endCopy).toHaveClass('ui-text', 'ui-text--tertiary', 'ui-text--sm');
  });

  it('shows retry action when incremental loading fails', () => {
    const handleRetryLoadMore = jest.fn();
    const handleLoadMore = jest.fn();

    render(
      <VirtualizedNoteList
        ariaLabel="Notes list"
        hasMore={true}
        hasLoadMoreError={true}
        isLoadingMore={false}
        notes={Array.from({ length: 6 }, (_, index) => buildNote(index))}
        onLoadMore={handleLoadMore}
        onRetryLoadMore={handleRetryLoadMore}
        onSelectNote={() => undefined}
        selectedNoteId={null}
      />,
    );

    expect(
      screen.getByText(/unable to load more notes\. try again\./i),
    ).toBeInTheDocument();

    screen.getByRole('button', { name: /retry/i }).click();

    expect(handleLoadMore).not.toHaveBeenCalled();
    expect(handleRetryLoadMore).toHaveBeenCalledTimes(1);
  });
});
