import { render, screen } from '@testing-library/react';

import { QueryProvider } from './providers/QueryProvider';
import { createQueryClient } from './providers/QueryProvider.handlers';
import { App } from './App';

describe('App', () => {
  it('renders activity explorer page', async () => {
    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: jest.fn((input: string) => {
        if (input.startsWith('/api/meta')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify({
                authors: [],
                colors: [],
                timeBounds: {
                  max: '2026-04-15T12:00:00.000Z',
                  min: '2026-04-10T12:00:00.000Z',
                },
                timeRangePresets: ['all', 'today', 'week', 'month'],
                total: 0,
              }),
          });
        }

        if (input.startsWith('/api/notes')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify({
                hasMore: false,
                items: [],
                nextCursor: null,
                total: 0,
              }),
          });
        }

        throw new Error(`Unhandled request: ${input}`);
      }),
    });

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

    const { container } = render(
      <QueryProvider client={queryClient}>
        <App />
      </QueryProvider>,
    );

    expect(container.firstChild).toHaveClass('app-shell');
    expect(
      container.querySelector('.app-application-topbar'),
    ).toHaveTextContent('Activity Explorer');
    expect(await screen.findByRole('heading', { name: /activity explorer/i })).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: /no notes match these filters/i }),
    ).toBeInTheDocument();
  });
});
