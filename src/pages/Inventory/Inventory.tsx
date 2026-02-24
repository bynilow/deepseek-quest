import {
    ACTIONS_GROUP_SEPARATOR,
    DELETED_ITEM_SEPARATOR,
    ITEMS_GROUP_SEPARATOR,
    RECEIVED_ITEM_SEPARATOR,
} from '@/app/App/constants';
import { StoredChat, STORIES_STORAGE_KEY } from '@/shared';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import * as S from './Inventory.styles';

const findGameInStorage: (chatId: string) => StoredChat | null = (chatId: string) => {
    const storiesLocalStorage = localStorage.getItem(STORIES_STORAGE_KEY);

    if (storiesLocalStorage)
        return (JSON.parse(storiesLocalStorage) as StoredChat[]).find(
            (story) => story.chatId === chatId,
        ) as StoredChat;

    return null;
};

const Inventory = () => {
    const location = useLocation();

    const { chatId } = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        return {
            chatId: searchParams.get('chat') || '',
        };
    }, [location]);

    const itemsList = useMemo(() => {
        const items: Record<string, number> = {};

        const foundedGame = findGameInStorage(chatId);

        if (foundedGame?.messages) {
            console.log('FOUNDED');
            const assistantMessagesWithItems = foundedGame?.messages
                .map((message) =>
                    message.role === 'assistant' ? message.content?.toString() || '' : null,
                )
                .filter((message) => message && message.includes(ITEMS_GROUP_SEPARATOR));
            console.log(assistantMessagesWithItems);

            const messagesWithItems = assistantMessagesWithItems
                .map((message) =>
                    message?.includes(DELETED_ITEM_SEPARATOR) ||
                    message?.includes(RECEIVED_ITEM_SEPARATOR)
                        ? message?.split(ITEMS_GROUP_SEPARATOR)[1]
                        : null,
                )
                .filter(Boolean);
            console.log(messagesWithItems);

            const replacedItems = messagesWithItems.map((message) =>
                message
                    ?.split(ACTIONS_GROUP_SEPARATOR)[0]
                    .replace(';', '')
                    .replace('\n', '')
                    .trim(),
            );
            console.log(replacedItems);

            replacedItems.forEach((message) => {
                if (message?.startsWith(DELETED_ITEM_SEPARATOR)) {
                    message
                        ?.replace(DELETED_ITEM_SEPARATOR, '')
                        .split(',')
                        .forEach((item) => {
                            item = item.trim();
                            const itemName = item.replace('x', '').split(' ').slice(1).join(' ');

                            if (item.startsWith('x')) {
                                const count = Number(item.replace('x', '').split(' ')[0]) || 1;
                                console.log('COUNT MINUS', count);
                                console.log('COUNT', item.replace('x', '').split(' '));

                                console.log('MINUS OPER', items[itemName] - count);

                                items[itemName] = items[itemName] ? items[itemName] - count : count;
                            } else {
                                items[item] = items[item] ? items[item] - 1 : 0;
                            }
                        });
                } else {
                    message
                        ?.replace(RECEIVED_ITEM_SEPARATOR, '')
                        .split(',')
                        .forEach((item) => {
                            item = item.trim();
                            const itemName = item.replace('x', '').split(' ').slice(1).join(' ');

                            if (item.startsWith('x')) {
                                const count = Number(item.replace('x', '').split(' ')[0]) || 1;
                                console.log('COUNT PLUS', count);
                                console.log('COUNT', item.replace('x', '').split(' '));

                                console.log('PLUS OPER', items[itemName] + count);
                                items[itemName] = items[itemName] ? items[itemName] + count : count;
                            } else {
                                items[item] = items[item] ? items[item] + 1 : 1;
                            }
                        });
                }
            });

            return items || {};
        }
        console.log('NOT FOUND');
        return {};
    }, [chatId]);

    console.log('INVENTORY', itemsList);

    return (
        <S.Items>
            {Object.entries(itemsList).map(([item, count]) => (
                <div key={item}>
                    {item}: {count}
                </div>
            ))}
        </S.Items>
    );
};

export { Inventory };
