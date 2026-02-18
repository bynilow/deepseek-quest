import React from 'react';
import ReactDOM from 'react-dom/client';
import { OpenAIProvider } from './context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { App } from './app/App/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      retry: 1,
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <OpenAIProvider>
        <App />
      </OpenAIProvider>
    </QueryClientProvider>
  </React.StrictMode>
);