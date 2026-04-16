import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';

const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 300_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
};

const createQueryClient = (
  config: QueryClientConfig = defaultQueryClientConfig,
): QueryClient => new QueryClient(config);

const sharedQueryClient = createQueryClient();

export { createQueryClient, sharedQueryClient };
