import React, { createContext, useContext } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: 'https://neuroapi.host/v1',
    apiKey: process.env.OPEN_AI_API_KEY,
    dangerouslyAllowBrowser: true
});

const OpenAIContext = createContext<OpenAI | null>(null);

const OpenAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <OpenAIContext.Provider value={openai}>
            {children}
        </OpenAIContext.Provider>
    );
};

const useOpenAI = () => {
    const context = useContext(OpenAIContext);
    if (!context) {
        throw new Error('useOpenAI must be used within OpenAIProvider');
    }
    return context;
};

export { OpenAIProvider, useOpenAI }