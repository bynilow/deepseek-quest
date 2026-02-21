import { ButtonHTMLAttributes, ChangeEvent, InputHTMLAttributes, MouseEvent, useEffect, useState } from "react";
import * as S from './Form.styles';

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <S.Button {...props}>
        {props.children}
    </S.Button>
};

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
    const [value, setInnerValue] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInnerValue(event.currentTarget.value);

        if (props.onChange) {
            props.onChange(event);
        }
    }

    useEffect(() => {
        setInnerValue(props.value?.toString() || '');
    }, [props.value]);

    return <S.Input {...props} value={value} onChange={handleChange}>

    </S.Input>
}

interface SelectProps {
    values: string[];
    value: string;
    onChange: (event: { target: { name: string; value: string } }) => void;
    placeholder: string;
    name: string;
}

const Select = ({ values, value, onChange, placeholder, name }: SelectProps) => {
    const [innerValue, setInnerValue] = useState(value || values[0]);

    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    const [isDropdownOpened, setIsDropdownOpened] = useState(false);

    const handleChange = (event: MouseEvent<HTMLButtonElement>, selectedValue: string) => {
        event.preventDefault();
        event.stopPropagation();

        setInnerValue(selectedValue);
        onChange({
            target: {
                name,
                value: selectedValue
            }
        });
        setIsDropdownOpened(false);
    }

    return (
        <>
            {isDropdownOpened && (
                <S.CloseDropdownBackground onClick={() => setIsDropdownOpened(false)} />
            )}
            <S.Select $isDropdownOpened={isDropdownOpened} onClick={() => setIsDropdownOpened(prevValue => !prevValue)}>
                {innerValue || <S.SelectPlaceholder>{placeholder}</S.SelectPlaceholder>}
                {
                    isDropdownOpened && (
                        <S.Dropdown>
                            {values.map(iterValue => <Button key={iterValue} onClick={(event) => handleChange(event, iterValue)}>{iterValue}</Button>)}
                        </S.Dropdown>
                    )
                }
            </S.Select>
        </>
    )
}

export { Button, Input, Select };
