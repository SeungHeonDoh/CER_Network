import React from 'react';
import useNetwork from '../../hook';
import { DescriptionArea } from '../../styles';
import Artist_Sideview from "./sideview";


export default function Description(props){
    const { activated } = useNetwork();
    return (
        console.log(activated),
        <DescriptionArea>
            {activated == null? (
                <h1>Searching....</h1>
            ) : (
                <div className="sideview">
                    <Artist_Sideview
                        name = {activated.attritube.name}
                        project = {activated.attritube.project}
                        key_list = {activated.attritube.key_list}
                        inside = {activated.attritube.inside}
                        outside = {activated.attritube.outside}
                        />
                </div>
            )
            }
        </DescriptionArea>
    )
}