import { useOpenAI } from '@/context';
import { Button, Input, type ChatMessage, type StoredChat } from '@/shared';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useChatMutation } from '../model';
import * as S from './App.styles';
import { BgImage } from '../assets';
import { NEW_GAME_FORM_KEYS, NewGameSettings, OtherGamesList, PAST_TIME, START_LOCATIONS, STORIES_STORAGE_KEY } from '@/widgets';
import { ACTIONS_GROUP_SEPARATOR, ACTIONS_SEPARATOR, NAME_SEPARATOR, NAME_TEXT_ANCHOR } from '../constants';
import { formatMessages } from '../lib';

const baseRule2 = `
    Давай сыграем в рпг квест в сеттинге зомбоапокалипсиса.

    Правила:
    - Ты должен всегда, после каждого своего ответа давать 3-4 выбора для игрока что делать дальше.
    - Ты должен описывать только то, что происходит после того, как игрок написал тебе свой вариант ответа (предложенный тобой), без дублирования (например: "Ты выбрал обойти зомби тихо", вместо этого пиши сразу что именно произошло, например: "Зомби тебя заметили и двигаются по направлению к тебе").
    - Чередуй моменты экшена (погони, сражения и т.д) и спокойствия (общение с другими людьми, осмотр баз и т.д.).    
    - Никогда и ни при каких ситуациях не выходи из контекста и не ломай "четвертую стену".
    - Для смертельной концовки используй 1-2 красиво описывающих смерть героя абзаца, а для обычного описания того, что происходит - МАКСИМУМ 4 предложения, не больше.
    - Никакой "телепортации" персонажа, если он в здании, он не может в следующем твоем сообщении оказаться на улице, все игровое действие должно идти через выбор персонажа. 
    - У персонажа не может волшебным образом появляться ресурсы которых у него нет (например: вода, еда, оружие, карта и т.д.).
    - НИКАКОЙ мета-информации по типу времени, города, названия главы, части и т.д. 
    - Все действия должны плавно перетекать из одного в другое.
    - Допустимо делать варианты - таймскипы (например: поспать до утра).
    - Варианты не взаимоисключающие, т.е., например, если в твоем описании ты написал что ГГ нашел тайник с припасами (вода и бита), он может взять все, ничего или что-то одно.
    - Ты ОБЯЗАН ВСЕГДА присылать варианты ответа (кроме смерти персонажа).
    - У предметов не может быть смежных значений, например: полупустая, заполненная на треть, в упаковке чипсов осталась горсть чипсов. Предмет либо есть, либо его нет.
    - Если ГГ отдает кому то предмет (или использует), то отдает ему полностью, он не может отдавать часть предмета (по аналогии с правилом выше).
    
    - Зомби являются медленно ходящими существами (по аналогии с сериалом ходячие мертвецы).
    - Персонаж может знакомиться с другими людьми (они могут быть как дружелюбные, так и нет, но даже с врагами, персонаж может помириться и найти общий язык).
    - Другие персонажи могут погибать (умирать) или подставлять игрока в собственных интересах (но не обязательно), могут быть любовные линии.
    - Если прошло значительное время с момента апокалипсиса, то у ГГ должен быть хоть какой то набор ресурсов, он не мог выжить столько времени без ничего. 
    - Действие происходит в америке наших годов.
    - Никаких зомби животных, только зомби люди.
    - Если ГГ вступил в группу, союз и т.д., то давай ему время от времени возможность попрощаться с другом, группой, компаньоном и т.д.

    - Варианты должны писаться в одну строку и разделяться этим знаком - ${ACTIONS_SEPARATOR} (например: Идти налево${ACTIONS_SEPARATOR} Идти направо${ACTIONS_SEPARATOR} Сходить назад${ACTIONS_SEPARATOR}).
    - Перед предложенными вариантами должен быть разделитель - ${ACTIONS_GROUP_SEPARATOR}.
    - Имена персонажей ВСЕГДА должны разделяться специальным символом (за ИСКЛЮЧЕНИЕМ вариантов выбора) - ${NAME_SEPARATOR} И перед имененем должен стоять специальный знак (за ИСКЛЮЧЕНИЕМ вариантов выбора) - ${NAME_TEXT_ANCHOR} (например: "Ты шел по дороге вместе с :${NAME_TEXT_ANCHOR}Джоном:, разговаривая о всяком", "Зомби настигает :${NAME_TEXT_ANCHOR}Джона:.").
    - Не добавляй в текст никаких специальных символов для украшений текста (например: *ты зашел в дом*).
    
    - Твой ответ должен иметь такую структуру:
        Действия
        ${ACTIONS_GROUP_SEPARATOR}
        Варианты выбора
        
        пример:

        Ты осторожно открываешь дверь, ведущую с крыши в подъезд. Металлическая дверь предательски скрипит, и звук эхом разносится по лестничной клетке. Замираешь на мгновение, прислушиваясь. Внизу, этажом ниже, слышится шорох и тяжелое, влажное дыхание.
        ${ACTIONS_GROUP_SEPARATOR}
        Попытаться очень тихо пробраться${ACTIONS_SEPARATOR} Использовать швейцарский нож${ACTIONS_SEPARATOR} Вернуться на крышу${ACTIONS_SEPARATOR}


    Начинаем прямо сейчас.

    Мой персонаж:
    Имя: $1
    Возраст: $2
    Пол: $3
    Стартовая локация: $4
    Время с момента апокалипсиса: $5
`

const saveChatToStorage = (chatId: string, newMessages: ChatMessage[]) => {
    const storiesLocalStorage = localStorage.getItem(STORIES_STORAGE_KEY);
    let parsedStories: StoredChat[] = [];

    if (storiesLocalStorage) {
        parsedStories = JSON.parse(storiesLocalStorage);
        console.log('to save chat id:', chatId)
        const foundedStory = parsedStories.find(story => story.chatId === chatId);
        if (foundedStory) {
            parsedStories = parsedStories.map(story => story.chatId === chatId ? { chatId: story.chatId, messages: newMessages } : story);
        } else {
            parsedStories = [...parsedStories, { chatId, messages: newMessages }];
        }
    } else {
        parsedStories = [
            ...parsedStories,
            {
                chatId: chatId,
                messages: newMessages,
            }
        ];
    }

    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(parsedStories));
}

const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [chatName, setChatName] = useState('');

    const openai = useOpenAI();

    const handleAddMessageFromAi = (message: string | null) => {
        const newMessages: ChatMessage[] = [...messages, { role: 'assistant', content: message }];

        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: message }]);
        saveChatToStorage(chatName, newMessages);
    }

    const { mutate, isPending, isSuccess, data } = useChatMutation(openai);

    useEffect(() => {
        if (isSuccess && data) {
            handleAddMessageFromAi(data || '');
        }
    }, [isSuccess, data])

    const handleSubmitAction = (action: string) => {
        const updatedMessages: ChatMessage[] = [
            ...messages,
            { role: "user", content: action }
        ];

        setMessages(updatedMessages);

        mutate({
            messages: updatedMessages
        });

        saveChatToStorage(chatName, updatedMessages);
    }


    const handleStartGame = (values: Record<NEW_GAME_FORM_KEYS, string>) => {
        const { name, age, sex, pastDays, startLocation } = values;

        let finalStartLocation = startLocation === START_LOCATIONS.random ? '' : startLocation;

        if (!finalStartLocation) {
            const startLocationWithoutRandom = Object.values(START_LOCATIONS).slice(1);
            console.log('finalStartLocation', startLocationWithoutRandom);
            finalStartLocation = startLocationWithoutRandom[Math.ceil(Math.random() * startLocationWithoutRandom.length - 1)];
        }

        let finalPastTime = pastDays === PAST_TIME.random ? '' : pastDays;

        if (!finalPastTime) {
            const pastTimeWithoutRandom = Object.values(PAST_TIME).slice(1);
            console.log('pastTimeWithoutRandom', pastTimeWithoutRandom);
            finalPastTime = pastTimeWithoutRandom[Math.ceil(Math.random() * pastTimeWithoutRandom.length - 1)];
        }

        const newMessages: ChatMessage[] = [{
            role: 'user',
            content: baseRule2.replace('$1', name).replace('$2', age).replace('$3', sex).replace('$4', finalStartLocation).replace('$5', finalPastTime)
        }];

        setChatName(`${name}, ${age}`);

        setMessages(newMessages);

        mutate({
            messages: newMessages
        });

        saveChatToStorage(`${name}, ${age}`, newMessages);
    }

    const handleChangeStory = (game: StoredChat) => {
        setChatName(game.chatId);

        setMessages(game.messages);

        if (game.messages[game.messages.length - 1].role === 'user') {
            mutate({
                messages: game.messages
            });
        }
    }

    const storyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (storyRef.current) {
            storyRef.current.scrollTo({
                top: storyRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const story = useMemo(() => formatMessages(messages, handleSubmitAction), [messages]);

    return (
        <>
            <S.globalStyles />
            <S.BackgroundImage src={BgImage} />
            <S.App>
                <OtherGamesList onSelectGame={handleChangeStory} />
                <S.StoryGroup>
                    {
                        messages.length === 0
                            ? <NewGameSettings onSubmit={handleStartGame} />
                            : <S.Story>
                                <S.StoryMessages ref={storyRef}>
                                    {
                                        story.story
                                    }
                                </S.StoryMessages>

                                {
                                    isPending && <p>Загружаюся...</p>
                                }

                                <S.Actions>
                                    {
                                        story.actions
                                    }
                                </S.Actions>
                            </S.Story>
                    }
                </S.StoryGroup>
            </S.App>
        </>
    );
};

export { App };

