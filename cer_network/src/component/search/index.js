import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import useNetwork from '../../hook';
import { SearchBar, SearchInput, SearchResults, SearchItem, SearchItemTitle, SearchItemValue } from '../../styles';



const TitleMapper = {
    artist: "Artist",
    project: "Project",
    word: "Keyword"
}

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
                <tbody>
                {results.map((result) => {
                    console.log(result);
                    let hasKeyword = false;
                    if(result.hasOwnProperty("attritube")){
                        hasKeyword = result.attritube.hasOwnProperty('key_list');
                    }
                    return (
                        <SearchItem
                            key={result.id}
                            onClick={()=>{handleClickItem(result)}}
                        >
                            <SearchItemTitle>
                                {TitleMapper[result.group]}
                            </SearchItemTitle>
                            <SearchItemValue>
                                {result.id}
                            </SearchItemValue>
                            <SearchItemTitle>
                                {hasKeyword?"Keyword":""}
                            </SearchItemTitle>
                            <SearchItemValue
                                width="100%"
                            >
                                {hasKeyword?result.attritube.key_list.join():""}
                            </SearchItemValue>
                        </SearchItem>
                    )
                })}
                </tbody>
            </SearchResults>
        </SearchBar>
    )
}