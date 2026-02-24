import * as S from './Loader.styles';

const Loader = () => {
    return (
        <S.LoaderWrapper>
            <S.Dot $delay={0} />
            <S.Dot $delay={300} />
            <S.Dot $delay={600} />
        </S.LoaderWrapper>
    );
};

export { Loader };
