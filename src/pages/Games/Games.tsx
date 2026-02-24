import { Button, PATHS, StoredChat, Title } from '@/shared';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORIES_STORAGE_KEY } from './constants';
import * as S from './Games.styles';

const findGamesInStorage: () => StoredChat[] = () => {
    const storiesLocalStorage = localStorage.getItem(STORIES_STORAGE_KEY);

    if (storiesLocalStorage) return JSON.parse(storiesLocalStorage);

    return [];
};

const Games = () => {
    const otherStories = useMemo(() => findGamesInStorage(), []);

    const navigate = useNavigate();

    const handleChangeStory = (gameId: string) => {
        const foundedGame = otherStories.find((story) => story.chatId === gameId);

        if (foundedGame) {
            navigate(`${PATHS.GAME}?chat=${foundedGame.chatId}`, { replace: true });
        }
    };

    return (
        <S.Games>
            <Title>Сохранённые игры</Title>
            <S.List>
                {otherStories.map((story) => (
                    <Button key={story.chatId} onClick={() => handleChangeStory(story.chatId)}>
                        {story.chatId}
                    </Button>
                ))}
            </S.List>
        </S.Games>
    );
};

export { Games };
