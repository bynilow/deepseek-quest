import { useOpenAI } from '@/context';
import type { ChatMessage, StoredChat } from '@/shared';
import React, { useEffect, useState } from 'react';
import { STORIES_STORAGE_KEY } from '../constants';
import { useChatMutation } from '../model';
import * as S from './App.styles';
import { BgImage } from '../assets';

const baseRules = `
    Давай сыграем в рпг квест в сеттинге зомбоапокалипсиса.

    Правила:
    - Ты должен всегда, после каждого своего ответа давать 3-4 выбора для игрока что делать дальше.
    - Ты должен описывать только то, что происходит после того, как игрок написал тебе свой вариант ответа (предложенный тобой), без дублирования (например, нельзя дублировать что то такое: "Ты выбрал обойти зомби тихо", вместо этого пиши сразу что именно произошло, например: "Зомби тебя заметили и двигаются по направлению к тебе").
    - Чередуй моменты экшена (погони, сражения и т.д) и спокойствия (общение с другими людьми, осмотр баз и т.д.).
    - Зомби являются медленно ходящими существами (по аналогии с сериалом ходячие мертвецы).
    - Персонаж может знакомиться с другими людьми (они могут быть как дружелюбные, так и нет, но даже с врагами, персонаж может помириться и найти общий язык).
    - Другие персонажи могут погибать или подставлять игрока в собственных интересах (но не обязательно), могут быть любовные линии.
    - Никогда и ни при каких ситуациях не выходи из контекста и не ломай "четвертую стену".
    - Для смертельной концовки используй 1-2 красиво описывающих смерть героя абзаца, а для обычного описания того, что происходит - максимум 3 предложения, не больше.
    - Никакой "телепортации" персонажа, если он в здании, он не может в следующем твоем сообщении оказаться на улице, все игровое действие должно идти через выбор персонажа. 
    - У персонажа не может волшебным образом появляться ресурсы которых у него нет (например: вода, еда, оружие, карта и т.д.).
    - Никакой мета-информации по типу времени, города, названия главы, части и т.д. 
    - Все действия должны плавно перетекать из одного в другое.
    - Допустимо делать варианты - таймскипы (например: поспать до утра).
    - Варианты не взаимоисключающие, т.е., например, если в твоем описании ты написал что ГГ нашел тайник с припасами (вода и бита), он может взять все, ничего или что-то одно.
    - Если прошло значительное время с момента апокалипсиса, то у ГГ должен быть хоть какой то набор ресурсов, он не мог выжить столько времени без ничего. 
    - В конце каждого варианта ответа надо ставить специальный символ - #.
    - Все имена персонажей надо разделять специальными символами - # и жирным шрифтом, например: #Джон#.
    - Все предметы которые может подобрать ГГ надо разделять тремя специальными символами - #G# и жирным шрифтом, например: #G#Банка тунца#G#.
    - При появлении предмета со специальными разделительными символами - #G# надо добавлять в инвентарь.
    - Все предметы которые потерял ГГ (Украли, съел, сломалось и т.д.) надо разделять тремя специальными символами - #R# и жирным шрифтом, например: #R#Бутылка воды#R#.
    - При удалении предмета со специальными разделительными символами - #R# надо убирать этот предмет из инвентаря.
    - В вариантах ответа не надо маркировать названия предметов.
    - У предметов не может быть смежных значений, например: полупустая, заполненная на треть, в упаковке чипсов осталась горсть чипсов. Предмет либо есть, либо его нет.
    - Если ГГ отдает кому то предмет (или использует), то отдает ему полностью, он не может отдавать часть предмета (по аналогии с правилом выше).

    Начинаем прямо сейчас.

    Мой персонаж:
    Имя: Ильдар
    Возраст: 23
    Пол: мужчина
    Стартовая локация: крыша многоэтажного дома
    Время с момента апокалипсиса: 3 дня
`

const ACTIONS_GROUP_SEPARATOR = ':v:';
const ACTIONS_SEPARATOR = ';';

const baseRule2 = `
    Давай сыграем в рпг квест в сеттинге зомбоапокалипсиса.

    Правила:
    - Ты должен всегда, после каждого своего ответа давать 3-4 выбора для игрока что делать дальше.
    - Ты должен описывать только то, что происходит после того, как игрок написал тебе свой вариант ответа (предложенный тобой), без дублирования (например, нельзя дублировать что то такое: "Ты выбрал обойти зомби тихо", вместо этого пиши сразу что именно произошло, например: "Зомби тебя заметили и двигаются по направлению к тебе").
    - Чередуй моменты экшена (погони, сражения и т.д) и спокойствия (общение с другими людьми, осмотр баз и т.д.).
    - Зомби являются медленно ходящими существами (по аналогии с сериалом ходячие мертвецы).
    - Персонаж может знакомиться с другими людьми (они могут быть как дружелюбные, так и нет, но даже с врагами, персонаж может помириться и найти общий язык).
    - Другие персонажи могут погибать или подставлять игрока в собственных интересах (но не обязательно), могут быть любовные линии.
    - Никогда и ни при каких ситуациях не выходи из контекста и не ломай "четвертую стену".
    - Для смертельной концовки используй 1-2 красиво описывающих смерть героя абзаца, а для обычного описания того, что происходит - МАКСИМУМ 4 предложения, не больше.
    - Никакой "телепортации" персонажа, если он в здании, он не может в следующем твоем сообщении оказаться на улице, все игровое действие должно идти через выбор персонажа. 
    - У персонажа не может волшебным образом появляться ресурсы которых у него нет (например: вода, еда, оружие, карта и т.д.).
    - Никакой мета-информации по типу времени, города, названия главы, части и т.д. 
    - Все действия должны плавно перетекать из одного в другое.
    - Допустимо делать варианты - таймскипы (например: поспать до утра).
    - Варианты не взаимоисключающие, т.е., например, если в твоем описании ты написал что ГГ нашел тайник с припасами (вода и бита), он может взять все, ничего или что-то одно.
    - Ты ОБЯЗАН ВСЕГДА присылать варианты ответа (кроме смерти персонажа).
    - Если прошло значительное время с момента апокалипсиса, то у ГГ должен быть хоть какой то набор ресурсов, он не мог выжить столько времени без ничего. 
    - У предметов не может быть смежных значений, например: полупустая, заполненная на треть, в упаковке чипсов осталась горсть чипсов. Предмет либо есть, либо его нет.
    - Если ГГ отдает кому то предмет (или использует), то отдает ему полностью, он не может отдавать часть предмета (по аналогии с правилом выше).
    - Действие происходит в америке наших годов.
    - Варианты должны писаться в одну строку и разделяться этим знаком - ${ACTIONS_SEPARATOR} (например: Идти налево${ACTIONS_SEPARATOR} Идти направо${ACTIONS_SEPARATOR} Сходить назад${ACTIONS_SEPARATOR}).
    - Перед предложенными вариантами должен быть разделитель - ${ACTIONS_GROUP_SEPARATOR}.
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
    console.log('new message for save: ', newMessages)
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

    console.log('saved to storage:', parsedStories)

    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(parsedStories));
}

const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [playerName, setPlayerName] = useState('');
    const [playerAge, setPlayerAge] = useState('');
    const [playerSex, setPlayerSex] = useState('');
    const [playerStartLocation, setPlayerStartLocation] = useState('');
    const [playerPastDays, setPlayerPastDays] = useState('');

    const [chatName, setChatName] = useState('');

    const openai = useOpenAI();

    const handleAddMessageFromAi = (message: string | null) => {
        const newMessages: ChatMessage[] = [...messages, { role: 'assistant', content: message }];
        console.log(chatName, messages, newMessages);

        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: message }]);
        saveChatToStorage(chatName, newMessages);
    }

    const { mutate, isPending, isSuccess, data } = useChatMutation(openai);

    useEffect(() => {
        if (isSuccess && data) {
            handleAddMessageFromAi(data || '');
        }
    }, [isSuccess, data])

    const handleSubmit = (action: string) => {
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


    const handleStartGame = () => {
        const newMessages: ChatMessage[] = [{
            role: 'user',
            content: baseRule2.replace('$1', playerName).replace('$2', playerAge).replace('$3', playerSex).replace('$4', playerStartLocation).replace('$5', playerPastDays)
        }];

        setChatName(`${playerName}, ${playerAge}`);

        setMessages(newMessages);

        mutate({
            messages: newMessages
        });

        saveChatToStorage(`${playerName}, ${playerAge}`, newMessages);

        setOtherStories(prevStories => [...prevStories, { chatId: `${playerName}, ${playerAge}`, messages: newMessages }])
    }

    const [otherStories, setOtherStories] = useState<StoredChat[]>(() => {
        const storiesLocalStorage = localStorage.getItem(STORIES_STORAGE_KEY);

        if (storiesLocalStorage) return JSON.parse(storiesLocalStorage);

        return [];
    });

    const handleChangeStory = (storyId: string) => {
        const foundedStory = otherStories.find(story => story.chatId === storyId);

        if (foundedStory) {
            setChatName(storyId);

            setMessages(foundedStory.messages);

            if (foundedStory.messages[foundedStory.messages.length - 1].role === 'user') {
                mutate({
                    messages: foundedStory.messages
                });
            }
        }
    }

    return (
        <>
            <S.globalStyles />
            <S.BackgroundImage src={BgImage} />
            <S.App>
                <S.StoryGroup>
                    {
                        messages.length === 0
                            ? <S.PlayerSetting>
                                <h1>настройка</h1>
                                <S.Input placeholder='имя' value={playerName} onChange={(event) => setPlayerName(event.currentTarget.value)} />
                                <S.Input placeholder='возраст' value={playerAge} onChange={(event) => setPlayerAge(event.currentTarget.value)} />
                                <S.Input placeholder='пол' value={playerSex} onChange={(event) => setPlayerSex(event.currentTarget.value)} />
                                <S.Input placeholder='стартовая локация' value={playerStartLocation} onChange={(event) => setPlayerStartLocation(event.currentTarget.value)} />
                                <S.Input placeholder='время с начала апокалипсиса' value={playerPastDays} onChange={(event) => setPlayerPastDays(event.currentTarget.value)} />
                                <S.Button
                                    onClick={handleStartGame}
                                    disabled={!playerName || !playerAge || !playerSex || !playerStartLocation || !playerPastDays}>
                                    начать
                                </S.Button>
                            </S.PlayerSetting>
                            : <S.Story>
                                <S.StoryMessages>
                                    {
                                        messages.slice(1).map(message => <p>
                                            {
                                                message.role === 'assistant'
                                                    ? message.content?.toString().split(ACTIONS_GROUP_SEPARATOR)?.[0] || 'ИИ не прислал действия'
                                                    : <S.Button disabled>{message.content?.toString()}</S.Button>
                                            }
                                        </p>)
                                    }
                                </S.StoryMessages>

                                {
                                    isPending && <p>Загружаюся...</p>
                                }

                                <S.Actions>
                                    {
                                        messages[messages.length - 1].role === 'assistant'
                                            ? messages[messages.length - 1].content?.toString()?.split(ACTIONS_GROUP_SEPARATOR)?.length === 2
                                                ? messages[messages.length - 1].content?.toString()?.split(ACTIONS_GROUP_SEPARATOR)?.[1].split(ACTIONS_SEPARATOR)?.filter(Boolean)
                                                    .map(action => <S.Button onClick={() => handleSubmit(action)}>{action}</S.Button>)
                                                : <b>ИИ не прислал действия</b>
                                            : null
                                    }
                                </S.Actions>
                            </S.Story>
                    }
                </S.StoryGroup>

                <S.OtherStories>
                    сохраненые игры
                    {
                        otherStories.map(story =>
                            <S.Button key={story.chatId} disabled={chatName === story.chatId} onClick={() => handleChangeStory(story.chatId)}>{story.chatId}</S.Button>
                        )
                    }
                </S.OtherStories>
            </S.App>
        </>
    );
};

export { App };

