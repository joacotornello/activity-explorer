import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { sharedQueryClient } from './QueryProvider.handlers';

type QueryProviderProps = PropsWithChildren<{
  client?: QueryClient;
}>;

export const QueryProvider = ({
  children,
  client = sharedQueryClient,
}: QueryProviderProps) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);
