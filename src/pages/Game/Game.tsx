import { useChatMutation } from '@/app';
import { ACTIONS_GROUP_SEPARATOR, DELETED_ITEM_SEPARATOR, ITEMS_GROUP_SEPARATOR, RECEIVED_ITEM_SEPARATOR } from '@/app/App/constants';
import { formatMessages } from '@/app/App/lib';
import { useOpenAI } from '@/context';
import { ChatMessage, saveChatToStorage, StoredChat, STORIES_STORAGE_KEY } from '@/shared';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as S from './Game.styles';

const findGameInStorage: (chatId: string) => StoredChat | null = (chatId: string) => {
    const storiesLocalStorage = localStorage.getItem(STORIES_STORAGE_KEY);

    if (storiesLocalStorage) return (JSON.parse(storiesLocalStorage) as StoredChat[]).find(story => story.chatId === chatId) as StoredChat;

    return null;
}

const Game = () => {
    const location = useLocation();

    const { chatId } = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        return {
            chatId: searchParams.get('chat') || ''
        }
    }, [location])

    const [messages, setMessages] = useState<ChatMessage[]>(findGameInStorage(chatId)?.messages || []);

    console.log('messages', messages)

    const [chatName, setChatName] = useState(findGameInStorage(chatId)?.chatId || '');

    const openai = useOpenAI();

    const handleAddMessageFromAi = (message: string | null) => {
        const newMessages: ChatMessage[] = [...messages, { role: 'assistant', content: message }];

        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: message }]);
        saveChatToStorage(chatName, newMessages);
    }

    const { mutate, isPending, isSuccess, data } = useChatMutation(openai);

    let items: Record<string, number> = {}

    // console.log(
    //     messages
    //         .map(message => message.role === 'assistant' ? message.content?.toString() || '' : null)
    //         .filter(message => message && message.includes(ITEMS_GROUP_SEPARATOR))
    //         .map(message => message?.includes(DELETED_ITEM_SEPARATOR) || message?.includes(RECEIVED_ITEM_SEPARATOR) ? message?.split(ITEMS_GROUP_SEPARATOR)[1] : null)
    //         .filter(Boolean)
    //         .map(message => message?.split(ACTIONS_GROUP_SEPARATOR)[0].replace(';', '').replace('\n', '').trim())
    //         .forEach(message => {
    //             if (message?.startsWith(DELETED_ITEM_SEPARATOR)) {
    //                 message?.replace(DELETED_ITEM_SEPARATOR, '').split(',').forEach(item => {
    //                     item = item.trim();

    //                     if (item.startsWith('x')) {
    //                         const itemName = item.replace('x', '').split(' ').slice(1).join(' ');
    //                         const count = Number(item.replace('x', '').split(' ')[0]) || 1;
    //                         console.log('COUNT MINUS', count)
    //                         console.log('COUNT', item.replace('x', '').split(' '))

    //                         console.log('MINUS OPER', items[itemName] - count)

    //                         items[itemName] =
    //                             items[itemName]
    //                                 ? items[itemName] - count
    //                                 : count
    //                     } else {
    //                         items[item] = items[item] ? items[item] - 1 : 0;
    //                     }
    //                 })
    //             } else {
    //                 message?.replace(RECEIVED_ITEM_SEPARATOR, '').split(',').forEach(item => {
    //                     item = item.trim();

    //                     if (item.startsWith('x')) {
    //                         const itemName = item.replace('x', '').split(' ').slice(1).join(' ');
    //                         const count = Number(item.replace('x', '').split(' ')[0]) || 1;
    //                         console.log('COUNT PLUS', count)
    //                         console.log('COUNT', item.replace('x', '').split(' '))

    //                         console.log('PLUS OPER', items[itemName] + count)
    //                         items[itemName] =
    //                             items[itemName]
    //                                 ? items[itemName] + count
    //                                 : count;

    //                     } else {
    //                         items[item] = items[item] ? items[item] + 1 : 1;
    //                     }
    //                 })
    //             }

    //         })
    // )

    // console.log(items)

    useEffect(() => {
        if (isSuccess && data) {
            handleAddMessageFromAi(data || '');
        }
    }, [isSuccess, data])

    useEffect(() => {
        if (messages[messages.length - 1].role === 'user') {
            mutate({
                messages,
            });
        }
    }, [])

    const handleSubmitAction = (action: string) => {
        const updatedMessages: ChatMessage[] = [
            ...messages,
            { role: "user", content: action }
        ];

        setMessages(updatedMessages);

        mutate({
            messages: updatedMessages
        });

        saveChatToStorage(chatName, updatedMessages);
    }

    const storyRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (storyRef.current) {
            storyRef.current.scrollTo({
                top: storyRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, storyRef]);

    const story = useMemo(() => formatMessages(messages, handleSubmitAction), [messages]);

    console.log('story', story)

    return (
        <S.StoryGroup>
            {
                messages.length > 0
                    ? (
                        <S.Story>
                            <S.StoryMessages ref={storyRef}>
                                {
                                    story.story
                                }
                            </S.StoryMessages>

                            {
                                isPending && <p>Загружаюся...</p>
                            }

                            <S.Actions>
                                {
                                    story.actions
                                }
                            </S.Actions>
                        </S.Story>
                    )
                    : null
            }
        </S.StoryGroup>
    )
};

export { Game };

