import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';

import { QueryProvider } from '../../providers/QueryProvider';
import { createQueryClient } from '../../providers/QueryProvider.handlers';
import { ActivityExplorerPage } from './ActivityExplorerPage';

type MockResponseInput = {
  body: unknown;
  ok?: boolean;
  status?: number;
};

const metaPayload = {
  authors: [
    {
      id: 'author-1',
      name: 'Ava Stone',
    },
    {
      id: 'author-2',
      name: 'Leo Kim',
    },
  ],
  colors: [
    {
      id: 'yellow',
      label: 'Yellow',
    },
    {
      id: 'blue',
      label: 'Blue',
    },
  ],
  timeBounds: {
    max: '2026-04-15T12:00:00.000Z',
    min: '2026-04-10T12:00:00.000Z',
  },
  timeRangePresets: ['all', 'today', 'week', 'month'],
  total: 2,
} as const;

const allNotesPayload = {
  hasMore: false,
  items: [
    {
      author: {
        id: 'author-1',
        name: 'Ava Stone',
      },
      color: 'yellow',
      createdAt: '2026-04-15T12:00:00.000Z',
      id: 'note-1',
      text: 'Keyboard-first filters keep exploration fast.',
    },
    {
      author: {
        id: 'author-2',
        name: 'Leo Kim',
      },
      color: 'blue',
      createdAt: '2026-04-15T09:00:00.000Z',
      id: 'note-2',
      text: 'Cursor pagination keeps long boards snappy.',
    },
  ],
  nextCursor: null,
  total: 2,
} as const;

const emptyNotesPayload = {
  hasMore: false,
  items: [],
  nextCursor: null,
  total: 0,
} as const;

const buildNotePayload = (index: number) => ({
  author: {
    id: `author-${(index % 2) + 1}`,
    name: index % 2 === 0 ? 'Ava Stone' : 'Leo Kim',
  },
  color: index % 2 === 0 ? 'yellow' : 'blue',
  createdAt: `2026-04-${`${15 - index}`.padStart(2, '0')}T12:00:00.000Z`,
  id: `note-${index + 1}`,
  text: `Feed note ${index + 1}`,
});

const paginatedFirstPagePayload = {
  hasMore: true,
  items: Array.from({ length: 6 }, (_, index) => buildNotePayload(index)),
  nextCursor: 'cursor-page-2',
  total: 7,
} as const;

const paginatedSecondPagePayload = {
  hasMore: false,
  items: [buildNotePayload(6)],
  nextCursor: null,
  total: 7,
} as const;

const createMockResponse = ({
  body,
  ok = true,
  status = ok ? 200 : 500,
}: MockResponseInput) =>
  Promise.resolve({
    ok,
    status,
    text: async () => JSON.stringify(body),
  });

const createDeferred = <TValue,>() => {
  let resolve: (value: TValue) => void = () => undefined;

  const promise = new Promise<TValue>((nextResolve) => {
    resolve = nextResolve;
  });

  return {
    promise,
    resolve,
  };
};

const renderActivityExplorerPage = () => {
  const queryClient = createQueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 0,
      },
    },
  });

  return render(
    <QueryProvider client={queryClient}>
      <ActivityExplorerPage />
    </QueryProvider>,
  );
};

describe('ActivityExplorerPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('shows loading states before rendering filters and feed without implicit selection', async () => {
    const metaDeferred = createDeferred<{
      ok: boolean;
      status: number;
      text: () => Promise<string>;
    }>();
    const notesDeferred = createDeferred<{
      ok: boolean;
      status: number;
      text: () => Promise<string>;
    }>();

    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: jest.fn((input: string) => {
        if (input.startsWith('/api/meta')) {
          return metaDeferred.promise;
        }

        if (input.startsWith('/api/notes')) {
          return notesDeferred.promise;
        }

        throw new Error(`Unhandled request: ${input}`);
      }),
    });

    renderActivityExplorerPage();

    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(
      screen.getByRole('status', { name: /loading notes/i }),
    ).toBeInTheDocument();

    metaDeferred.resolve(await createMockResponse({ body: metaPayload }));
    notesDeferred.resolve(await createMockResponse({ body: allNotesPayload }));

    expect(
      await screen.findByRole('heading', { name: /activity explorer/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('checkbox', { name: /ava stone/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /note from ava stone/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /selected note from ava stone/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('complementary', { name: /note details/i }),
    ).not.toBeInTheDocument();
  });

  it('switches note details from feed selection and allows closing selection', async () => {
    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: jest.fn((input: string) => {
        if (input.startsWith('/api/meta')) {
          return createMockResponse({ body: metaPayload });
        }

        if (input.startsWith('/api/notes')) {
          return createMockResponse({ body: allNotesPayload });
        }

        throw new Error(`Unhandled request: ${input}`);
      }),
    });

    renderActivityExplorerPage();

    const avaNoteButton = await screen.findByRole('button', {
      name: /note from ava stone/i,
    });

    fireEvent.click(avaNoteButton);

    const detailsPanel = await screen.findByRole('complementary', {
      name: /note details/i,
    });
    const closeButton = within(detailsPanel).getByRole('button', {
      name: /close note details/i,
    });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    expect(
      within(detailsPanel).getByText(
        /keyboard-first filters keep exploration fast/i,
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /note from leo kim/i }));

    expect(
      await within(detailsPanel).findByText(
        /cursor pagination keeps long boards snappy/i,
      ),
    ).toBeInTheDocument();

    closeButton.focus();
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('complementary', { name: /note details/i }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /note from leo kim/i }),
      ).toHaveFocus();
    });
    expect(
      screen.queryByRole('button', { name: /selected note from ava stone/i }),
    ).not.toBeInTheDocument();
  });

  it('opens mobile note details as dialog, focuses close action, and restores trigger focus', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn(() => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        matches: false,
        media: '(min-width: 1181px)',
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: jest.fn((input: string) => {
        if (input.startsWith('/api/meta')) {
          return createMockResponse({ body: metaPayload });
        }

        if (input.startsWith('/api/notes')) {
          return createMockResponse({ body: allNotesPayload });
        }

        throw new Error(`Unhandled request: ${input}`);
      }),
    });

    renderActivityExplorerPage();

    const avaNoteButton = await screen.findByRole('button', {
      name: /note from ava stone/i,
    });

    avaNoteButton.focus();
    fireEvent.click(avaNoteButton);

    const dialog = await screen.findByRole('dialog', {
      name: /note details/i,
    });
    const closeButton = within(dialog).getByRole('button', {
      name: /close note details/i,
    });

    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });

    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: /note details/i }),
      ).not.toBeInTheDocument();
    });
    expect(avaNoteButton).toHaveFocus();
  });

  it('renders empty state for filtered results and clears filters back to feed', async () => {
    const fetchMock = jest.fn((input: string) => {
      if (input.startsWith('/api/meta')) {
        return createMockResponse({ body: metaPayload });
      }

      if (input.startsWith('/api/notes')) {
        const requestUrl = new URL(input, 'http://localhost');

        if (requestUrl.searchParams.get('authors') === 'author-2') {
          return createMockResponse({ body: emptyNotesPayload });
        }

        return createMockResponse({ body: allNotesPayload });
      }

      throw new Error(`Unhandled request: ${input}`);
    });

    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: fetchMock,
    });

    renderActivityExplorerPage();

    expect(
      await screen.findByRole('button', { name: /note from leo kim/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /leo kim/i }));

    expect(
      await screen.findByRole('heading', {
        name: /no notes match these filters/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /no notes match these filters\.\s+try clearing one or more filters\./i,
      ),
    ).toBeInTheDocument();
    expect(window.location.search).toContain('authors=author-2');
    await waitFor(() => {
      expect(document.title).toBe('Activity Explorer | Explore note activity by author, color, and time');
      expect(
        document.head.querySelector('link[data-seo-key="canonical"]'),
      ).toHaveAttribute('href', 'http://localhost/?authors=author-2');
    });

    const feedEmptyState = screen
      .getByRole('heading', { name: /no notes match these filters/i })
      .closest('[role="status"]');

    if (feedEmptyState === null) {
      throw new Error('Expected feed empty state container.');
    }

    fireEvent.click(
      within(feedEmptyState as HTMLElement).getByRole('button', {
        name: /^clear$/i,
      }),
    );

    expect(
      await screen.findByRole('button', { name: /note from leo kim/i }),
    ).toBeInTheDocument();
    expect(window.location.search).toBe('');

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(
          '/api/notes?limit=30&timeRange=all',
        ),
        expect.objectContaining({
          headers: {
            Accept: 'application/json',
          },
          method: 'GET',
        }),
      );
    });
  });

  it('shows error state and retries failed notes request', async () => {
    let shouldFailNotesRequest = true;
    const fetchMock = jest.fn((input: string) => {
      if (input.startsWith('/api/meta')) {
        return createMockResponse({ body: metaPayload });
      }

      if (input.startsWith('/api/notes')) {
        if (shouldFailNotesRequest) {
          return createMockResponse({
            body: {
              message: 'Notes exploded.',
            },
            ok: false,
            status: 500,
          });
        }

        return createMockResponse({ body: allNotesPayload });
      }

      throw new Error(`Unhandled request: ${input}`);
    });

    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: fetchMock,
    });

    renderActivityExplorerPage();

    expect(
      await screen.findByRole('heading', { name: /unable to load activity/i }),
    ).toBeInTheDocument();

    shouldFailNotesRequest = false;
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    expect(
      await screen.findByRole('button', { name: /note from ava stone/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('complementary', { name: /note details/i }),
    ).not.toBeInTheDocument();
  });

  it('surfaces next-page errors and lets user retry incremental loading', async () => {
    let shouldFailNextPage = true;
    const fetchMock = jest.fn((input: string) => {
      if (input.startsWith('/api/meta')) {
        return createMockResponse({ body: metaPayload });
      }

      if (input.startsWith('/api/notes')) {
        const requestUrl = new URL(input, 'http://localhost');

        if (requestUrl.searchParams.get('cursor') === 'cursor-page-2') {
          if (shouldFailNextPage) {
            return createMockResponse({
              body: {
                message: 'Next page exploded.',
              },
              ok: false,
              status: 500,
            });
          }

          return createMockResponse({ body: paginatedSecondPagePayload });
        }

        return createMockResponse({ body: paginatedFirstPagePayload });
      }

      throw new Error(`Unhandled request: ${input}`);
    });

    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: fetchMock,
    });

    renderActivityExplorerPage();

    expect(await screen.findAllByRole('button', { name: /note from ava stone/i })).not.toHaveLength(0);

    expect(
      await screen.findByText(/unable to load more notes\. try again\./i),
    ).toBeInTheDocument();

    expect(
      fetchMock.mock.calls.filter(([input]) =>
        String(input).includes('cursor=cursor-page-2'),
      ),
    ).toHaveLength(1);

    shouldFailNextPage = false;
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(/unable to load more notes\. try again\./i),
      ).not.toBeInTheDocument();
    });

    expect(
      fetchMock.mock.calls.filter(([input]) =>
        String(input).includes('cursor=cursor-page-2'),
      ),
    ).toHaveLength(2);
  });

  it('replays filter state from browser history changes', async () => {
    const filteredNotesPayload = {
      ...allNotesPayload,
      items: [allNotesPayload.items[1]],
      total: 1,
    } as const;
    const fetchMock = jest.fn((input: string) => {
      if (input.startsWith('/api/meta')) {
        return createMockResponse({ body: metaPayload });
      }

      if (input.startsWith('/api/notes')) {
        const requestUrl = new URL(input, 'http://localhost');

        if (requestUrl.searchParams.get('authors') === 'author-2') {
          return createMockResponse({ body: filteredNotesPayload });
        }

        return createMockResponse({ body: allNotesPayload });
      }

      throw new Error(`Unhandled request: ${input}`);
    });

    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: fetchMock,
    });

    renderActivityExplorerPage();

    expect(
      await screen.findByRole('button', { name: /note from ava stone/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /leo kim/i }));

    expect(window.location.search).toBe('?authors=author-2');
    expect(
      await screen.findByRole('button', { name: /note from leo kim/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /note from ava stone/i }),
    ).not.toBeInTheDocument();

    act(() => {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(
      await screen.findByRole('button', { name: /note from ava stone/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /leo kim/i })).not.toBeChecked();
  });
});
