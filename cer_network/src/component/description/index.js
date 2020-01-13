import React from 'react';
import useNetwork from '../../hook';
import {DescriptionArea, contentsContainer, subContents, mainContents} from '../../styles';

export default function Description(props){
    const { activated } = useNetwork();
    console.log(activated);
    return (
        <DescriptionArea>
            <contentHeader id={activated.id}/>
            <contentsContainer>
                {activated.id}
                {/* {Object.keylist(activated.attribute).map((contentKey) => (
                    Object.value(activated.attribute).map((contentValue) => (
                        <>
                        <div id="renderpalce">
                            <subContents>
                                {contentKey}
                            </subContents>
                            <mainContents>
                                ```need to python to JS
                                if contents is string:
                                    return {contentValue}
                                elif contents is list:
                                    return {contentvalue.map((detailContents) =>
                                        {detailContents}
                                    )}
                                ```
                            </mainContents>
                        </div>
                        </>
                        )))
                )} */}
            </contentsContainer>
        </DescriptionArea>
    )
}