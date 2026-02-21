import styled from "styled-components";
import { createGlobalStyle } from 'styled-components'

const globalStyles = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        background: #1b1d1d;
    }

    *::-webkit-scrollbar {
        width: 8px;
    }
    *::-webkit-scrollbar-track {
        background: none;
    }
    *::-webkit-scrollbar-thumb {
        background-color: #dfe0e0;
        border-radius: 20px;
    }

    * {
        font-family: "Inter", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
        box-sizing: border-box;
    }
`

const App = styled.div`
    position: relative;
    gap: 24px;
    width: 100vw;
    height: 100vh;
    color: #dfe0e0;
    z-index: 1;
    padding: 16px;
`;

const BackgroundImage = styled.img`
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0.3;
    top: 0;
    left: 0;
    z-index: -1;
    filter: blur(50px);
`

const StoryGroup = styled.div`
    height: 100%;
    overflow: hidden;
`;

const Story = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    height: 100%;
`

const Actions = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    @media (max-width: 786px) {
        flex-direction: column;
        align-items: center;

        button {
            width: 100%;
        }
    }
`

const StoryMessages = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    width: 90%;

    @media (max-width: 786px) {
        width: 100%;
    }
`

const CharacterName = styled.span`
    color: #c6f0ff;
    font-weight: bold;
`

export {
    App,
    StoryGroup,
    globalStyles,
    BackgroundImage,
    Story,
    Actions,
    StoryMessages,
    CharacterName
};
