import { Button, leftArrowIcon, PATHS, SwitchButton } from '@/shared';
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

const NavBar = () => {
    const [selectedTab, setSelectedTab] = useState<string>(TAB_NAME.NEW_GAME);

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
            case PATHS.HOME: {
                setSelectedTab(TAB_NAME.NEW_GAME);
                break;
            }
            case PATHS.GAMES: {
                setSelectedTab(TAB_NAME.GAMES);
                break;
            }
            case PATHS.INVENTORY: {
                setSelectedTab(TAB_NAME.INVENTORY);
                break;
            }
            case PATHS.GAME: {
                setSelectedTab(TAB_NAME.GAME);
                break;
            }
        }
    }, [location])

    const handleChangeTab = (path: string) => {
        setSelectedTab(path);

        if (path === PATHS.HOME) {
            navigate(PATHS.HOME);
        } else {
            navigate(`${path}?chat=${chatId}`, { replace: true });
        }

    }

    return (
        <S.NavBar>
            {
                !chatId && (
                    <>
                        <SwitchButton isActive={selectedTab === TAB_NAME.NEW_GAME} onClick={() => handleChangeTab(PATHS.HOME)}>
                            Новая
                        </SwitchButton>
                        <SwitchButton isActive={selectedTab === TAB_NAME.GAMES} onClick={() => handleChangeTab(PATHS.GAMES)}>
                            Игры
                        </SwitchButton>
                    </>
                )
            }
            {
                chatId && (
                    <>
                        <SwitchButton isActive={selectedTab === TAB_NAME.BACK} icon={leftArrowIcon} onClick={() => handleChangeTab(PATHS.HOME)} />
                        <SwitchButton isActive={selectedTab === TAB_NAME.GAME} onClick={() => handleChangeTab(PATHS.GAME)}>
                            Игра
                        </SwitchButton>
                        <SwitchButton isActive={selectedTab === TAB_NAME.INVENTORY} onClick={() => handleChangeTab(PATHS.INVENTORY)}>
                            Инвентарь
                        </SwitchButton>
                    </>
                )
            }

        </S.NavBar>
    )
}

export { NavBar };
