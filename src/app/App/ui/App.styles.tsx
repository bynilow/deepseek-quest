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

const Button = styled.button`
    padding: 16px 32px;
    background-color: #4141415a;
    color: #dfe0e0;
    font-size: 16px;
    border-radius: 1000px;
    outline: none;
    border: 1px solid #dfe0e045;
    backdrop-filter: blur(5px);
    cursor: pointer;
    font-weight: bold;
    width: fit-content;

    transition: 0.3s ease;

    &:disabled {
        background-color: #1b1d1e;
        border: 1px solid #dfe0e014;
        color: #a1a1a1;
        cursor: default;
    };
`

const Input = styled.input`
    padding: 16px;
    background-color: #4141415a;
    color: #dfe0e0;
    font-size: 16px;
    border-radius: 1000px;
    outline: none;
    border: 1px solid #dfe0e045;
    backdrop-filter: blur(5px);
    font-weight: bold;
`

const PlayerSetting = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

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
`

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

export { App, StoryGroup, OtherStories, Button, Input, globalStyles, BackgroundImage, PlayerSetting, Story, Actions, StoryMessages, OtherGamesButtonWrapper, CloseOtherGamesBackground };
