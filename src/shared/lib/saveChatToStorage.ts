import { STORIES_STORAGE_KEY } from "../constants";
import { ChatMessage, StoredChat } from "../model";

const saveChatToStorage = (chatId: string, newMessages: ChatMessage[]) => {
    const storiesLocalStorage = localStorage.getItem(STORIES_STORAGE_KEY);
    let parsedStories: StoredChat[] = [];

    if (storiesLocalStorage) {
        parsedStories = JSON.parse(storiesLocalStorage);
        console.log('to save chat id:', chatId)
        const foundedStory = parsedStories.find(story => story.chatId === chatId);
        if (foundedStory) {
            parsedStories = parsedStories.map(story => story.chatId === chatId ? { chatId: story.chatId, messages: newMessages } : story);
        } else {
            parsedStories = [...parsedStories, { chatId, messages: newMessages }];
        }
    } else {
        parsedStories = [
            ...parsedStories,
            {
                chatId: chatId,
                messages: newMessages,
            }
        ];
    }

    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(parsedStories));
}

export { saveChatToStorage };