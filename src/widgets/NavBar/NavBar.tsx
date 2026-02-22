import { Button, SwitchButton } from '@/shared';
import * as S from './NavBar.styles';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

enum TAB_NAME {
    NEW_GAME = 'newGame',
    GAMES = 'games',
    INVENTORY = 'inventory',
}

const PATHS: Record<TAB_NAME, string> = {
    newGame: '/',
    games: '/games',
    inventory: '/inv',
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
    }, [location])

    const handleChangeTab = (tab: TAB_NAME) => {
        setSelectedTab(tab);

        navigate(`${PATHS[tab]}?chat=${chatId}`);
    }

    return (
        <S.NavBar>
            <SwitchButton isActive={selectedTab === TAB_NAME.NEW_GAME} onClick={() => handleChangeTab(TAB_NAME.NEW_GAME)}>
                Новая
            </SwitchButton>
            <SwitchButton isActive={selectedTab === TAB_NAME.GAMES} onClick={() => handleChangeTab(TAB_NAME.GAMES)}>
                Игры
            </SwitchButton>
            {
                chatId && (
                    <SwitchButton isActive={selectedTab === TAB_NAME.INVENTORY} onClick={() => handleChangeTab(TAB_NAME.INVENTORY)}>
                        Инвентарь
                    </SwitchButton>
                )
            }

        </S.NavBar>
    )
}

export { NavBar };
