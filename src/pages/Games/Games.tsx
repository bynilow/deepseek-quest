import { useState } from 'react';
import * as S from './Games.styles';
import { Button, StoredChat } from '@/shared';
import { STORIES_STORAGE_KEY } from './constants';
import { useNavigate } from 'react-router-dom';

const findGamesInStorage: () => StoredChat[] = () => {
    const storiesLocalStorage = localStorage.getItem(STORIES_STORAGE_KEY);

    if (storiesLocalStorage) return JSON.parse(storiesLocalStorage);

    return [];
}

const Games = () => {
    const [otherStories, setOtherStories] = useState<StoredChat[]>(findGamesInStorage());

    const navigate = useNavigate();

    const handleChangeStory = (gameId: string) => {
        const foundedGame = otherStories.find(story => story.chatId === gameId);

        if (foundedGame) {
            navigate(`/game?chat=${foundedGame.chatId}`, { replace: true })
        }
    }

    return (
        <S.Games>
            сохраненые игры
            <S.List>
                {
                    otherStories.map(story =>
                        <Button key={story.chatId} onClick={() => handleChangeStory(story.chatId)}>{story.chatId}</Button>
                    )
                }
            </S.List>
        </S.Games>
    )
};

export { Games };
