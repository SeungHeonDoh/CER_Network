import React from "react";
import { ObjectContainer, RowContainer, TextContainer } from '../../styles';

export default function ObjectUI({dict}){
    const key_list = Object.keys(dict)
    const value_list = Object.values(dict)
    const zipped = key_list.map((x, i) => [x, value_list[i]]);
    return (
        <ObjectContainer>
        {zipped.map((data) => {
            if(isNaN(data[1]))
                return (
                    <>
                    <TextContainer>
                        {data[1]}
                    </TextContainer>
                    </>
                )
            return (
                <>
                    <TextContainer>
                        {Math.round(data[1]*10000)/100} %
                    </TextContainer>
                </>
            )
        })}
        </ObjectContainer>
    );
}