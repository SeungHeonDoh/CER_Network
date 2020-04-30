import React from 'react';
import useNetwork from '../../hook';
import { DescriptionArea } from '../../styles';
import Infopage from './info_page'
import DefaultPage from './default_page';

export default function Description(props){
    const { activated } = useNetwork();
    let render = null;
    if (activated!==null){
        render = <Infopage information={activated} />;
    } else {
        render = <DefaultPage/>;
    }
    return (
        <DescriptionArea>
            {render}
        </DescriptionArea>
    )
}