import styled from "styled-components"

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

const Select = styled.div<{ $isDropdownOpened: boolean }>`
    padding: 16px;
    background-color: #4141415a;
    color: #dfe0e0;
    font-size: 16px;
    border-radius: 1000px;
    outline: none;
    border: 1px solid #dfe0e045;
    backdrop-filter: blur(5px);
    font-weight: bold;
    position: relative;
    user-select: none;
    cursor: pointer;
    z-index: ${({ $isDropdownOpened }) => $isDropdownOpened ? '3' : '1'};
`

const SelectPlaceholder = styled.span`
    color: #6d6d6d;
`

const CloseDropdownBackground = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
`

const Dropdown = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    z-index: 10;
    position: absolute;
    top: calc(54px + 4px);
    left: 0;
    border: 1px solid #dfe0e045;
    backdrop-filter: blur(5px);
    background-color: #1b1d1e;
    border-radius: 24px;
    max-height: 450px;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;

    button {
        width: 100%;
        white-space: nowrap;
    }
`;

export { Button, Input, Select, Dropdown, CloseDropdownBackground, SelectPlaceholder };
