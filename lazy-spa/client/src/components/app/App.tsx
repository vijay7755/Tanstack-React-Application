import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactElement } from 'react';
import { queryClient } from 'react-query/queryClient';

import { theme } from '../../theme';
import { Loading } from './Loading';
import { Navbar } from './Navbar';
import { Routes } from './Routes';
import { ErrorBoundary } from 'react-error-boundary';

export function App(): ReactElement {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Navbar />
        <Loading />
        <Routes />
        <ReactQueryDevtools />
        </ErrorBoundary>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
