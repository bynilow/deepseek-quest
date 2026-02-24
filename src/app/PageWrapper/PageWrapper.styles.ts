import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

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
        -webkit-tap-highlight-color: transparent;
    }
`;

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    gap: 24px;
    display: flex;
    flex-direction: column;
    color: #dfe0e0;
    z-index: 1;
    padding: 16px;
    padding-top: calc(59px + 32px);
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
`;

export { globalStyles, Wrapper, BackgroundImage };
