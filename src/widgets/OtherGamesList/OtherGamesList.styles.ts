import styled from "styled-components";

const OtherStories = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    z-index: 10;
    position: absolute;
    top: 32px;
    right: 32px;
    border: 1px solid #dfe0e045;
    backdrop-filter: blur(5px);
    border-radius: 16px;

    button {
        width: 100%;
        white-space: nowrap;
    }
`;

const OtherGamesButtonWrapper = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    margin: 16px;
    z-index: 10;
`

const CloseOtherGamesBackground = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
`


export { OtherStories, OtherGamesButtonWrapper, CloseOtherGamesBackground }