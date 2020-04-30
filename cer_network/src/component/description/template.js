import React from "react";
import { CenterContainer, HeaderContainer, HeaderContents, Image, Logo} from '../../styles'
import zer01ne from "../../img/zer01ne.png"
import logo from "../../img/logo.png"

export default function Template(){
    return (
        <>
        <CenterContainer>
        <HeaderContainer>
            <Logo background={logo}/>
            <HeaderContents>
                Creator
            </HeaderContents>
            <HeaderContents>
                Project
            </HeaderContents>
            <HeaderContents>
                Keyword
            </HeaderContents>
        </HeaderContainer>
        <Image background={zer01ne}/>
        </CenterContainer>
        </>
    );
  }