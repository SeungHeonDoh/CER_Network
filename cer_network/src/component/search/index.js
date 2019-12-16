import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import useNetwork from '../../hook';
import { SearchBar, SearchInput } from '../../styles';
import { Search as SearchLib } from 'semantic-ui-react'

export default function Search(){
    const { changeActivate, data } = useNetwork();
    const [ input, setInput ] = useState('');
    const [ result, setResult ] = useState();

    useEffect(() => {
        handleSearchChange(null, input);
    }, [input])

    function onChangeEvent(event){
        setInput(event.target.value);
    }

    function onEnterEvent(event){
        if(event.key === 'Enter'){
            changeActivate(input);
            setInput('');
        }
    }

    function handleSearchChange(e, value){
        setTimeout(() => {
            if (value.length < 1) {

                return
            }
      
            const re = new RegExp(_.escapeRegExp(value), 'i')
            const isMatch = (result) => re.test(result.id)
            const res = _.filter(data.nodes, isMatch)
            console.log(res);
            setResult(res);
        }, 300)
    }

    return (
        <SearchBar>
            <SearchInput 
                placeholder="ZeroOne Artist, Project, Keyword를 입력해보세요."
                value={input}
                onChange={onChangeEvent}
                onKeyPress={onEnterEvent}
            />
            <SearchLib
                onSearchChange={_.debounce(handleSearchChange, 500, {
                  leading: true,
                })}
                hidden={true}
            />
        </SearchBar>
    )
}