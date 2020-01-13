import React from 'react';
import {HeaderContainer, ImageContainer, MainImage} from '../../styles';


export default function contentHeader(){
    return(
        <HeaderContainer>
            <Header>
            <div id="groupIsArtist">
                Artist
            </div>
            <div id="groupIsProject">
                Project
            </div>
            <div id="groupIsKeyword">
                Keyword
            </div>
            </Header>

            <ImageContainer>
                <MainImage/>
                <BackgroundImage/>
            </ImageContainer>
        </HeaderContainer>

    );
};