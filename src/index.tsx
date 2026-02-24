import React from 'react';
import ReactDOM from 'react-dom/client';
import { OpenAIProvider } from './context';
import { App } from './app/App/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Game, Games, Inventory } from './pages';
import { PageWrapper } from './app';

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
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PageWrapper>
                                    <App />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/games"
                            element={
                                <PageWrapper>
                                    <Games />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/game"
                            element={
                                <PageWrapper>
                                    <Game />
                                </PageWrapper>
                            }
                        />
                        <Route
                            path="/inv"
                            element={
                                <PageWrapper>
                                    <Inventory />
                                </PageWrapper>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </OpenAIProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
