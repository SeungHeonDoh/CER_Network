import React from "react";
import PropTypes from "prop-types";
import {Wapper,SubHeader,Contents} from "../../styles/description";


function Artist_Sideview({name, project, key_list, inside, outside}){
    return (
        <Wapper>
            <SubHeader>작가명</SubHeader>
                <Contents>{name}</Contents>

            <SubHeader>키워드</SubHeader>
                <Contents>
                    {key_list.map((key_list) => (
                            <li>
                                {key_list}
                            </li>
                        ))}
                </Contents>

            <SubHeader>프로젝트</SubHeader>
                <Contents>
                    {project.map((project) => (
                            <li>
                                {project}
                            </li>
                        ))}
                </Contents>

            <SubHeader>내부참여자</SubHeader>
                <Contents>
                    {inside.map((inside) => (
                            <li>
                                {inside}
                            </li>
                        ))}
                </Contents>
            <SubHeader>외부참여자</SubHeader>
                <Contents>
                    {outside.map((outside) => (
                            <li>
                                {outside}
                            </li>
                        ))}
                </Contents>
                
        </Wapper>
    );
}

Artist_Sideview.propTypes = {
    name: PropTypes.string.isRequired,
    project: PropTypes.arrayOf(PropTypes.string).isRequired,
    key_list: PropTypes.arrayOf(PropTypes.string).isRequired,
    inside: PropTypes.arrayOf(PropTypes.string).isRequired,
    outside: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

export default Artist_Sideview;
