import { ChatMessage } from "@/shared";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import OpenAI from "openai";

interface ChatMutationVariables {
    messages: ChatMessage[];
}

const useChatMutation = (
    openaiClient: OpenAI,
    options?: UseMutationOptions<
        string | null,
        Error,
        ChatMutationVariables
    >,
) => {
    return useMutation({
        mutationFn: async ({ messages }) => {
            const completion = await openaiClient.chat.completions.create({
                messages,
                model: "deepseek-v3.2",
            });

            return completion.choices[0].message.content;
        },
        ...options,
    });
};

export { useChatMutation };
