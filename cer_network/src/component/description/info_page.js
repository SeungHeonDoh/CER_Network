import React from "react";
import Template from "./template"
import ObjectUI from "./objectUI"
import { ObjectContainer, RowContainer, DescriptionContainer, SmallCase,MiddleCase,HighCase} from '../../styles';

export default function InfoPage({information}){
    let attribute = null;
    if(information.hasOwnProperty("attritube")){
        attribute = information.attritube;
    }
    const key_list = Object.keys(attribute)
    const value_list = Object.values(attribute)
    const zipped = key_list.map((x, i) => [x, value_list[i]]);

    return (
        <>
            <DescriptionContainer>
                <Template/>
                {zipped.map(data => {
                    console.log(data[1])
                    if(data[0] === "name")
                        return (
                            <>
                            <SmallCase>
                                {data[0]}
                            </SmallCase>
                            <HighCase>
                                {data[1]}
                            </HighCase>
                            </>
                        )

                    else if(data[1].constructor === String)
                        return (
                            <>
                            <SmallCase>
                                {data[0]}
                            </SmallCase>
                            <MiddleCase>
                                {data[1]}
                            </MiddleCase>
                            </>
                        )
                    else if(data[1].constructor === Array)
                        return (
                            <>
                            <SmallCase>
                                {data[0]}
                            </SmallCase>
                                {data[1].map(inside => {
                                    if(inside.constructor === Object)
                                        return(
                                            <MiddleCase>
                                                <ObjectUI dict ={inside}/>
                                            </MiddleCase>
                                        )
                                    else if(inside.constructor === String)
                                        return(
                                            <MiddleCase>
                                                {inside}
                                            </MiddleCase>
                                        )
                                    else if(inside.constructor === Array)
                                        return(
                                            <MiddleCase>
                                                {inside[0]}
                                            </MiddleCase>
                                        )
                                })}
                            </>
                        )
                })}
            </DescriptionContainer>
        </>

    );
    }