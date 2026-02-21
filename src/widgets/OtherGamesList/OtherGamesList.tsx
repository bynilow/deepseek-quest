import { Button, StoredChat } from "@/shared";
import * as S from './OtherGamesList.styles';
import { useState } from "react";
import { STORIES_STORAGE_KEY } from "./constants";

interface Props {
    onSelectGame: (game: StoredChat) => void;
    currentGameId?: string;
}

const findGamesInStorage: () => StoredChat[] = () => {
    const storiesLocalStorage = localStorage.getItem(STORIES_STORAGE_KEY);

    if (storiesLocalStorage) return JSON.parse(storiesLocalStorage);

    return [];
}

const OtherGamesList = ({ onSelectGame, currentGameId }: Props) => {
    const [isDropdownOpened, setIsDropdownOpened] = useState(false);

    const [otherStories, setOtherStories] = useState<StoredChat[]>(findGamesInStorage());

    const handleChangeStory = (gameId: string) => {
        const foundedGame = otherStories.find(story => story.chatId === gameId);

        if (foundedGame) {
            onSelectGame(foundedGame);
        }

        setIsDropdownOpened(false);
    }

    const handleOpenDropDown = () => {
        setOtherStories(findGamesInStorage());

        setIsDropdownOpened(true)
    }

    return (
        <>
            {
                isDropdownOpened && (
                    <S.CloseOtherGamesBackground onClick={() => setIsDropdownOpened(false)} />
                )
            }
            <S.OtherGamesButtonWrapper>
                <Button onClick={handleOpenDropDown}>G</Button>
                {
                    isDropdownOpened && (
                        <S.OtherStories>
                            сохраненые игры
                            {
                                otherStories.map(story =>
                                    <Button key={story.chatId} disabled={currentGameId === story.chatId} onClick={() => handleChangeStory(story.chatId)}>{story.chatId}</Button>
                                )
                            }
                        </S.OtherStories>
                    )
                }
            </S.OtherGamesButtonWrapper>

        </>
    )
};

export { OtherGamesList };
