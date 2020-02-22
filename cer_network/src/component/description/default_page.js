import React from "react";
import Template from "./template"
import statstics from "../../img/statistics.png"
import { Stat, DescriptionContainer, SmallCase,MiddleCase,HighCase } from '../../styles';

export default function DefaultPage(){
  return (
        <>
        <DescriptionContainer>
        <Template/>
            <SmallCase>
                Project
            </SmallCase>
            <HighCase>
                ZER01NE - CER NETWORK
            </HighCase>

            <SmallCase>
                Describtion
            </SmallCase>

            <MiddleCase>
                CER NETWORK는 각 Creator들이 사용한 그들의 언어를 통하여, 그들을 고차원의 의미공간에 표현하게 되었으며 이 표현공간을 통해 유사한 아티스트와 프로젝트를 찾고자 합니다.<br/>
                <br/>
                각각의 Creator, Project, Keyword들이 고차원의 의미공간인 Word2vec에서 표현되었으며, 각 백터로 표현된 단어로 인하여, 우리는 시각화되어 현재의 CER-NETWORK를 확인할 수 있습니다.
            </MiddleCase>

            <SmallCase>
                Project URL
            </SmallCase>
            <MiddleCase>
                <a href="http://cer.network">
                http://cer.network
                </a>
            </MiddleCase>

            <SmallCase>
                Statstics
            </SmallCase>
            <Stat background={statstics}/>


        </DescriptionContainer>
        </>

  );
}