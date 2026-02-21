import { Button, ChatMessage } from "@/shared";
import { ACTIONS_GROUP_SEPARATOR, ACTIONS_SEPARATOR, NAME_SEPARATOR, NAME_TEXT_ANCHOR } from "../constants";
import * as S from '../ui/App.styles';

const formatMessages = (messages: ChatMessage[], handleSubmit: (action: string) => void) => {
    const story =
        messages.length
            ? messages.slice(1).map(message => <p>
                {
                    message.role === 'assistant'
                        ? message.content?.toString()
                            .split(ACTIONS_GROUP_SEPARATOR)?.[0]
                            .split(NAME_SEPARATOR)
                            .map((sentence, index) => {
                                if (sentence.charAt(0) === NAME_TEXT_ANCHOR) {
                                    return <S.CharacterName key={sentence + index}>{sentence.slice(1)}</S.CharacterName>
                                }

                                return sentence

                            }) || 'ИИ не прислал действия'
                        : <Button disabled>{message.content?.toString()}</Button>
                }
            </p>)
            : [];


    const actions =
        messages.length
            ? messages[messages.length - 1].role === 'assistant'
                ? messages[messages.length - 1].content?.toString()?.split(ACTIONS_GROUP_SEPARATOR)?.length === 2
                    ? messages[messages.length - 1].content?.toString()
                        ?.split(ACTIONS_GROUP_SEPARATOR)?.[1]
                        .split(ACTIONS_SEPARATOR)
                        ?.filter(Boolean)
                        .map(action => <Button onClick={() => handleSubmit(action)}>
                            {
                                action
                                    .split(NAME_SEPARATOR)
                                    .map((sentence, index) => {
                                        if (sentence.charAt(0) === NAME_TEXT_ANCHOR) {
                                            return <S.CharacterName key={sentence + index}>{sentence.slice(1)}</S.CharacterName>
                                        }

                                        return sentence

                                    })
                            }
                        </Button>)
                    : <b>ИИ не прислал действия</b>
                : []
            : [];

    return {
        story,
        actions
    }
}

export { formatMessages };
