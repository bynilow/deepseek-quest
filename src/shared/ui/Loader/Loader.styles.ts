import styled, { keyframes } from 'styled-components';

const LoaderWrapper = styled.div`
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
`;

const rotate = keyframes`
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
    100%{
        transform: translateY(0);
    }
`;

const Dot = styled.div<{ $delay: number }>`
    width: 10px;
    height: 10px;
    background-color: #c6f0ff;
    border-radius: 50%;

    animation: ${rotate} 2s ease infinite;
    animation-delay: ${({ $delay }) => $delay}ms;
`;

export { LoaderWrapper, Dot };
