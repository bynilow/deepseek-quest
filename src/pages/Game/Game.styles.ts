import styled from "styled-components";

const StoryGroup = styled.div`
    height: 100%;
    overflow: hidden;
`;

const Story = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    height: 100%;
`;

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

export { StoryGroup, Story, Actions, StoryMessages };
