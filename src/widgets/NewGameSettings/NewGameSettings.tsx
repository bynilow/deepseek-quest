import { Button, Input, Select } from '@/shared';
import * as S from './NewGameSettings.styles';
import { Formik } from 'formik';
import { PAST_TIME, SEX, START_LOCATIONS } from './constants';

enum NEW_GAME_FORM_KEYS {
    NAME = 'name',
    AGE = 'age',
    SEX = 'sex',
    START_LOCATION = 'startLocation',
    PAST_DAYS = 'pastDays',
}

interface Props {
    onSubmit: (form: Record<NEW_GAME_FORM_KEYS, string>) => void;
}

const NewGameSettings = ({ onSubmit }: Props) => {
    return (
        <Formik
            initialValues={{
                [NEW_GAME_FORM_KEYS.NAME]: '',
                [NEW_GAME_FORM_KEYS.AGE]: '',
                [NEW_GAME_FORM_KEYS.SEX]: '',
                [NEW_GAME_FORM_KEYS.START_LOCATION]: '',
                [NEW_GAME_FORM_KEYS.PAST_DAYS]: '',
            }}
            onSubmit={onSubmit}>
            {({ values, handleChange, handleSubmit }) => {
                console.log(values);

                return (
                    <S.NewGameSettings onSubmit={handleSubmit}>
                        <h1>настройка</h1>
                        <Input
                            name={NEW_GAME_FORM_KEYS.NAME}
                            placeholder='имя'
                            onChange={handleChange}
                            value={values[NEW_GAME_FORM_KEYS.NAME]} />
                        <Input
                            name={NEW_GAME_FORM_KEYS.AGE}
                            placeholder='возраст'
                            onChange={handleChange}
                            value={values[NEW_GAME_FORM_KEYS.AGE]} />
                        <Select
                            name={NEW_GAME_FORM_KEYS.SEX}
                            placeholder='пол'
                            onChange={handleChange}
                            value={values[NEW_GAME_FORM_KEYS.SEX]}
                            values={Object.values(SEX)} />
                        <Select
                            name={NEW_GAME_FORM_KEYS.START_LOCATION}
                            placeholder='стартовая локация'
                            value={values[NEW_GAME_FORM_KEYS.START_LOCATION]}
                            onChange={handleChange}
                            values={Object.values(START_LOCATIONS)} />
                        <Select
                            name={NEW_GAME_FORM_KEYS.PAST_DAYS}
                            placeholder='время с начала апокалипсиса'
                            values={Object.values(PAST_TIME)}
                            onChange={handleChange}
                            value={values[NEW_GAME_FORM_KEYS.PAST_DAYS]} />

                        <Button type="submit" disabled={
                            !values[NEW_GAME_FORM_KEYS.NAME] ||
                            !values[NEW_GAME_FORM_KEYS.AGE] ||
                            !values[NEW_GAME_FORM_KEYS.SEX] ||
                            !values[NEW_GAME_FORM_KEYS.START_LOCATION] ||
                            !values[NEW_GAME_FORM_KEYS.PAST_DAYS]
                        }>
                            начать
                        </Button>
                    </S.NewGameSettings>
                )
            }}
        </Formik>
    )
}

export { NewGameSettings, NEW_GAME_FORM_KEYS };
