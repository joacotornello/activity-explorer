type MatchMediaConfig = {
  matches?: boolean;
  resolveMatches?: (query: string) => boolean;
};

type MatchMediaListener = (
  event: MediaQueryListEvent | MediaQueryList,
) => void;

const createMockMediaQueryList = (
  query: string,
  matches: boolean,
): MediaQueryList => {
  const listeners = new Set<MatchMediaListener>();

  return {
    addEventListener: jest.fn(
      (_type: string, listener: EventListenerOrEventListenerObject) => {
        if (typeof listener === 'function') {
          listeners.add(listener as MatchMediaListener);
        }
      },
    ),
    addListener: jest.fn((listener: MatchMediaListener) => {
      listeners.add(listener);
    }),
    dispatchEvent: jest.fn((event: Event) => {
      listeners.forEach((listener) => {
        listener(event as MediaQueryListEvent);
      });

      return true;
    }),
    matches,
    media: query,
    onchange: null,
    removeEventListener: jest.fn(
      (_type: string, listener: EventListenerOrEventListenerObject) => {
        if (typeof listener === 'function') {
          listeners.delete(listener as MatchMediaListener);
        }
      },
    ),
    removeListener: jest.fn((listener: MatchMediaListener) => {
      listeners.delete(listener);
    }),
  } as MediaQueryList;
};

const mockWindowMatchMedia = ({
  matches = true,
  resolveMatches,
}: MatchMediaConfig = {}): jest.MockedFunction<typeof window.matchMedia> => {
  const matchMedia = jest.fn((query: string) =>
    createMockMediaQueryList(
      query,
      resolveMatches ? resolveMatches(query) : matches,
    ),
  );

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: matchMedia,
  });

  return matchMedia;
};

export { mockWindowMatchMedia };
