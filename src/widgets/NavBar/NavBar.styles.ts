import styled from 'styled-components';

const NavBar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100% - 32px);
    margin: 16px;
    background-color: #09090b;
    padding: 12px;
    display: flex;
    gap: 16px;
    border-radius: 1000px;
    z-index: 11;
`;

export { NavBar };
