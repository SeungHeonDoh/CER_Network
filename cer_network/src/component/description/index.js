import React from 'react';
import useNetwork from '../../hook';
import { DescriptionArea } from '../../styles';

export default function Description(props){
    const { activated } = useNetwork();
    return (
        <DescriptionArea>
            {activated!==null?
                activated.id:""
            }
        </DescriptionArea>
    )
}