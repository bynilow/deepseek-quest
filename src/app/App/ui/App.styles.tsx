import styled from 'styled-components';

const App = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    gap: 24px;
    color: #dfe0e0;
    z-index: 1;
`;

const CharacterName = styled.span`
    color: #c6f0ff;
    font-weight: bold;
`;

const DeletedItem = styled.div`
    color: #f87171;
    font-size: 14px;
`;

const RecivedItem = styled.div`
    color: #7bf1a8;
    font-size: 14px;
`;

const Items = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export { App, CharacterName, DeletedItem, RecivedItem, Items };
