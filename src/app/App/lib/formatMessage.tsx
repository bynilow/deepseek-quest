import { Button, ChatMessage } from '@/shared';
import {
    ACTIONS_GROUP_SEPARATOR,
    ACTIONS_SEPARATOR,
    DELETED_ITEM_SEPARATOR,
    ITEMS_GROUP_SEPARATOR,
    NAME_SEPARATOR,
    NAME_TEXT_ANCHOR,
    RECEIVED_ITEM_SEPARATOR,
} from '../constants';
import * as S from '../ui/App.styles';

const formatMessages = (messages: ChatMessage[], handleSubmit: (action: string) => void) => {
    const story = messages.length
        ? messages.slice(1).map((message) => (
              <div key={message.content?.toString()}>
                  <p>
                      {/* Текст истории */}
                      {message.role === 'assistant' ? (
                          message.content
                              ?.toString()
                              .split(ACTIONS_GROUP_SEPARATOR)?.[0]
                              .split(ITEMS_GROUP_SEPARATOR)[0]
                              .split(NAME_SEPARATOR)
                              .map((sentence, index) => {
                                  if (sentence.charAt(0) === NAME_TEXT_ANCHOR) {
                                      return (
                                          <S.CharacterName key={sentence + index}>
                                              {sentence.slice(1)}
                                          </S.CharacterName>
                                      );
                                  }

                                  return sentence;
                              }) || 'ИИ не прислал действия'
                      ) : (
                          <Button disabled>
                              {message.content
                                  ?.toString()
                                  .split(NAME_SEPARATOR)
                                  .map((sentence, index) => {
                                      if (sentence.charAt(0) === NAME_TEXT_ANCHOR) {
                                          return (
                                              <S.CharacterName key={sentence + index}>
                                                  {sentence.slice(1)}
                                              </S.CharacterName>
                                          );
                                      }

                                      return sentence;
                                  })}
                          </Button>
                      )}
                  </p>

                  {/* Предметы */}
                  <S.Items>
                      {message.role === 'assistant'
                          ? message.content
                                ?.toString()
                                .split(ITEMS_GROUP_SEPARATOR)?.[1]
                                ?.split(ACTIONS_GROUP_SEPARATOR)?.[0]
                                .replace(DELETED_ITEM_SEPARATOR, '- ')
                                .replace(RECEIVED_ITEM_SEPARATOR, '+ ')
                                ?.split('\n')
                                ?.map((itemsGroup) =>
                                    itemsGroup.startsWith('-')
                                        ? itemsGroup
                                              .replace(';', '')
                                              .replace('-', '')
                                              .split(',')
                                              .map((item, index) =>
                                                  item.length ? (
                                                      <S.DeletedItem key={item + index}>
                                                          -{`${item} \n`}
                                                      </S.DeletedItem>
                                                  ) : null,
                                              )
                                        : itemsGroup
                                              .replace(';', '')
                                              .replace('+', '')
                                              .split(',')
                                              .map((item, index) =>
                                                  item.length ? (
                                                      <S.RecivedItem key={item + index}>
                                                          +{`${item} \n`}
                                                      </S.RecivedItem>
                                                  ) : null,
                                              ),
                                )
                          : null}
                  </S.Items>
              </div>
          ))
        : [];

    const actions = messages.length ? (
        messages[messages.length - 1].role === 'assistant' ? (
            messages[messages.length - 1].content?.toString()?.split(ACTIONS_GROUP_SEPARATOR)
                ?.length === 2 ? (
                messages[messages.length - 1].content
                    ?.toString()
                    ?.split(ACTIONS_GROUP_SEPARATOR)?.[1]
                    .split(ACTIONS_SEPARATOR)
                    ?.filter(Boolean)
                    .map((action) => (
                        <Button key={action} onClick={() => handleSubmit(action)}>
                            {action.split(NAME_SEPARATOR).map((sentence, index) => {
                                if (sentence.charAt(0) === NAME_TEXT_ANCHOR) {
                                    return (
                                        <S.CharacterName key={sentence + index}>
                                            {sentence.slice(1)}
                                        </S.CharacterName>
                                    );
                                }

                                return sentence;
                            })}
                        </Button>
                    ))
            ) : (
                <b>ИИ не прислал действия</b>
            )
        ) : (
            []
        )
    ) : (
        []
    );

    return {
        story,
        actions,
    };
};

export { formatMessages };
