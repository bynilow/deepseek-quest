import { Button, leftArrowIcon, SwitchButton } from '@/shared';
import * as S from './NavBar.styles';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

enum TAB_NAME {
    NEW_GAME = 'newGame',
    GAMES = 'games',
    GAME = 'game',
    INVENTORY = 'inventory',
    BACK = 'back',
}

const PATHS: Record<TAB_NAME, string> = {
    newGame: '/',
    games: '/games',
    game: '/game',
    inventory: '/inv',
    back: '/',
}

interface Props {
    onChange: (tab: TAB_NAME) => void;
}

const NavBar = ({ onChange }: Props) => {
    const [selectedTab, setSelectedTab] = useState(TAB_NAME.NEW_GAME);

    const navigate = useNavigate();

    const location = useLocation();

    const { chatId } = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        return {
            chatId: searchParams.get('chat') || ''
        }
    }, [location]);

    useEffect(() => {
        switch (location.pathname) {
            case PATHS.newGame: {
                setSelectedTab(TAB_NAME.NEW_GAME);
                break;
            }
            case PATHS.games: {
                setSelectedTab(TAB_NAME.GAMES);
                break;
            }
            case PATHS.inventory: {
                setSelectedTab(TAB_NAME.INVENTORY);
                break;
            }
            case PATHS.game: {
                setSelectedTab(TAB_NAME.GAME);
                break;
            }
        }
    }, [location])

    const handleChangeTab = (tab: TAB_NAME) => {
        setSelectedTab(tab);

        if (tab === TAB_NAME.BACK) {
            navigate(PATHS[tab]);
        } else {
            navigate(`${PATHS[tab]}?chat=${chatId}`);
        }

    }

    return (
        <S.NavBar>
            {
                !chatId && (
                    <>
                        <SwitchButton isActive={selectedTab === TAB_NAME.NEW_GAME} onClick={() => handleChangeTab(TAB_NAME.NEW_GAME)}>
                            Новая
                        </SwitchButton>
                        <SwitchButton isActive={selectedTab === TAB_NAME.GAMES} onClick={() => handleChangeTab(TAB_NAME.GAMES)}>
                            Игры
                        </SwitchButton>
                    </>
                )
            }
            {
                chatId && (
                    <>
                        <SwitchButton isActive={selectedTab === TAB_NAME.BACK} icon={leftArrowIcon} onClick={() => handleChangeTab(TAB_NAME.BACK)} />
                        <SwitchButton isActive={selectedTab === TAB_NAME.GAME} onClick={() => handleChangeTab(TAB_NAME.GAME)}>
                            Игра
                        </SwitchButton>
                        <SwitchButton isActive={selectedTab === TAB_NAME.INVENTORY} onClick={() => handleChangeTab(TAB_NAME.INVENTORY)}>
                            Инвентарь
                        </SwitchButton>
                    </>
                )
            }

        </S.NavBar>
    )
}

export { NavBar };
