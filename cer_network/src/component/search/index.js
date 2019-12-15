import React, { useState } from 'react';
import useNetwork from '../../hook';
import { SearchBar, SearchInput } from '../../styles';

export default function Search(){
    const { changeActivate } = useNetwork();
    const [ input, setInput ] = useState('');

    function onChangeEvent(event){
        setInput(event.target.value);
    }

    function onEnterEvent(event){
        if(event.key === 'Enter'){
            changeActivate(input);
            setInput('');
        }
    }

    return (
        <SearchBar>
            <SearchInput 
                placeholder="ZeroOne Artist, Project, Keyword를 입력해보세요."
                value={input}
                onChange={onChangeEvent}
                onKeyPress={onEnterEvent}
            />
        </SearchBar>
    )
}