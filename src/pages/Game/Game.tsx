import { useChatMutation } from '@/app';
import { formatMessages } from '@/app/App/lib';
import { useOpenAI } from '@/context';
import { ChatMessage, Loader, saveChatToStorage, StoredChat, STORIES_STORAGE_KEY } from '@/shared';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as S from './Game.styles';

const findGameInStorage: (chatId: string) => StoredChat | null = (chatId: string) => {
    const storiesLocalStorage = localStorage.getItem(STORIES_STORAGE_KEY);

    if (storiesLocalStorage)
        return (JSON.parse(storiesLocalStorage) as StoredChat[]).find(
            (story) => story.chatId === chatId,
        ) as StoredChat;

    return null;
};

const Game = () => {
    const location = useLocation();

    const { chatId } = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        return {
            chatId: searchParams.get('chat') || '',
        };
    }, [location]);

    const [messages, setMessages] = useState<ChatMessage[]>(
        findGameInStorage(chatId)?.messages || [],
    );

    // TODO: убрать после проверки джобы линтера — намеренный no-unused-vars
    const eslintCiTestUnused = true;

    console.log('messages', messages)

    const chatName = useMemo(() => findGameInStorage(chatId)?.chatId || '', [chatId]);

    const openai = useOpenAI();

    const handleAddMessageFromAi = (message: string | null) => {
        const newMessages: ChatMessage[] = [...messages, { role: 'assistant', content: message }];

        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: message }]);
        saveChatToStorage(chatName, newMessages);
    };

    const { mutate, isPending, isSuccess, data } = useChatMutation(openai);

    useEffect(() => {
        if (isSuccess && data) {
            handleAddMessageFromAi(data || '');
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (messages[messages.length - 1].role === 'user') {
            mutate({
                messages,
            });
        }
    }, []);

    const handleSubmitAction = (action: string) => {
        const updatedMessages: ChatMessage[] = [...messages, { role: 'user', content: action }];

        setMessages(updatedMessages);

        mutate({
            messages: updatedMessages,
        });

        saveChatToStorage(chatName, updatedMessages);
    };

    const storyRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (storyRef.current) {
            storyRef.current.scrollTo({
                top: storyRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, storyRef]);

    const story = useMemo(() => formatMessages(messages, handleSubmitAction), [messages]);

    console.log('story', story);

    return (
        <S.StoryGroup>
            {messages.length > 0 ? (
                <S.Story>
                    <S.StoryMessages ref={storyRef}>{story.story}</S.StoryMessages>

                    {isPending && <Loader />}

                    <S.Actions>{story.actions}</S.Actions>
                </S.Story>
            ) : null}
        </S.StoryGroup>
    );
};

export { Game };
