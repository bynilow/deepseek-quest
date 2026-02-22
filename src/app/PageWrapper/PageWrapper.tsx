import { NavBar } from '@/widgets';
import { BgImage } from './assets';
import * as S from './PageWrapper.styles';

interface Props {
    children: React.ReactElement;
}

const PageWrapper = ({ children }: Props) => {

    return (
        <>
            <S.globalStyles />
            <S.BackgroundImage src={BgImage} />
            <S.Wrapper>
                <NavBar />
                {children}
            </S.Wrapper>
        </>
    )
};

export { PageWrapper };
