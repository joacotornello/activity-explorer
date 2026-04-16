import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import { QueryProvider } from '../../providers/QueryProvider';
import { createQueryClient } from '../../providers/QueryProvider.handlers';
import { mockWindowMatchMedia } from '../../../test/matchMedia';
import { ActivityExplorerPage } from './ActivityExplorerPage';

type MockResponseInput = {
  body: unknown;
  ok?: boolean;
  status?: number;
};

const metaPayload = {
  authors: [
    {
      count: 1,
      id: 'author-1',
      name: 'Ava Stone',
    },
    {
      count: 1,
      id: 'author-2',
      name: 'Leo Kim',
    },
  ],
  colors: [
    {
      count: 1,
      id: 'yellow',
      label: 'Yellow',
    },
    {
      count: 1,
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

const mockSuccessfulRequests = () => {
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
};

describe('ActivityExplorerPage a11y', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('has no critical axe violations in loaded desktop state', async () => {
    mockSuccessfulRequests();

    const { container } = renderActivityExplorerPage();

    await screen.findByRole('heading', { name: /activity explorer/i });
    await screen.findByRole('checkbox', { name: /ava stone/i });
    await screen.findByRole('button', { name: /note from ava stone/i });

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no critical axe violations with mobile note details dialog open', async () => {
    mockWindowMatchMedia({ matches: false });
    mockSuccessfulRequests();

    const { container } = renderActivityExplorerPage();

    const noteButton = await screen.findByRole('button', {
      name: /note from ava stone/i,
    });

    fireEvent.click(noteButton);

    await screen.findByRole('dialog', { name: /note details/i });

    expect(await axe(container)).toHaveNoViolations();
  });
});
