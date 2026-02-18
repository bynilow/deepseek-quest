import OpenAI from "openai";

type ChatMessage =
    | OpenAI.Chat.ChatCompletionSystemMessageParam
    | OpenAI.Chat.ChatCompletionUserMessageParam
    | OpenAI.Chat.ChatCompletionAssistantMessageParam;

interface StoredChat {
    chatId: string;
    messages: ChatMessage[];
}

export type { ChatMessage, StoredChat };
