import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import useNetwork from '../../hook';
import { SearchBar, SearchInput, SearchResults, SearchItem } from '../../styles';


export default function Search(){
    const { changeActivate, data } = useNetwork();
    const [ input, setInput ] = useState('');
    const [ results, setResults ] = useState([]);

    useEffect(() => {
        handleSearchChange(null, input);
    }, [input])

    function reset(){
        setInput('');
        setResults([]);
    }

    function onChangeEvent(event){
        setInput(event.target.value);
    }

    function handleClickItem(node){
        changeActivate(node);
        reset()
    }

    function onEnterEvent(event){
        if(event.key === 'Enter'){
            if(results.length>0){
                changeActivate(results[0]);
            }
            reset()
        }
    }

    function handleSearchChange(e, value){
        setTimeout(() => {
            if (value.length < 1) {
                return
            }
      
            const re = new RegExp(_.escapeRegExp(value), 'i')
            const isMatch = (results) => re.test(results.id)
            const res = _.filter(data.nodes, isMatch).slice(0, 5);
            setResults(res);
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
            <SearchResults>
                {results.map((result) => {
                    return (
                        <SearchItem
                            onClick={()=>{handleClickItem(result)}}
                        >
                            {result.id}
                        </SearchItem>
                    )
                })}
            </SearchResults>
        </SearchBar>
    )
}