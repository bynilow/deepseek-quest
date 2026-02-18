import styled from "styled-components";

const App = styled.div`
    display: grid;
    grid-template-columns: 1fr 0.3fr;
    gap: 24px;
`;

const StoryGroup = styled.div`
    
`;

const OtherStories = styled.div`
    display: flex;
    flex-direction: column;
`;

const Button = styled.button`
    margin: 8px;
`

const Input = styled.input`
    margin: 4px;
`

export { App, StoryGroup, OtherStories, Button, Input };
