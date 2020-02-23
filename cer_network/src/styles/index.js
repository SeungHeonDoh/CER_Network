import styled from 'styled-components'


export const RowContainer = styled.div `
    display: flex;
    flex-direction: row;
`

export const ObjectContainer = styled.div `
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

export const TextContainer = styled.div `
    opacity: 0.9;
    font-size: 1em;
`


export const SmallCase = styled.div `
    opacity: 0.5;
    font-size: 0.8em;
    margin-top : 2em;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
`
export const MiddleCase = styled.div `
    opacity: 0.9;
    font-size: 1em;
    margin-top : 5px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
`
export const HighCase = styled.div `
    font-size: 1.2em;
    margin-top : 5px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
`


export const DescriptionContainer = styled.div `
    height : 100%;
    margin : 2em 2em 2em 2em;
    display: flex;
    flex-direction: column;
`


export const CenterContainer = styled.div `
    width : 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const HeaderContainer = styled.div `
    width : 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const HeaderContents = styled.div `
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
`

export const Logo = styled.div`
    height: 20px;
    width : 100px;
    background-image: url(${({ background }) => background});
    background-repeat: no-repeat;
    background-size: contain;
`;

export const Stat = styled.div`
    width : 100%;
    height: 200px;
    background-image: url(${({ background }) => background});
    background-repeat: no-repeat;
    background-size: contain;
    margin-top : 15px;
`;


export const Image = styled.div`
    width : 100%;
    height: 200px;
    background-image: url(${({ background }) => background});
    background-repeat: no-repeat;
    background-size: contain;
    margin-top : 3em;
`;



export const SearchItemValue = styled.th `
    width: ${(props) => props.width? props.width: "15%"};
    font-size: 15px;
    text-align: left;
`


export const SearchItemTitle = styled.th `
    width: 10%;
    font-size: 15px;
    opacity: 0.5;
    text-align: left;
    padding-left: 20px;
    padding-bottom: 1.5em;
    padding-top: 1.5em;
`

export const SearchItem = styled.tr `
    background-color: rgb(26, 26, 26, 0.5);
    border-bottom: solid 1px white;
    width: 100%;

    &:hover{
        background-color: #000000;
        background-color: rgba( 0, 0, 0, 0.5 );
    }

`
export const SearchResults = styled.table `
    position: absolute;
    top: 72px;
    left: 0px;
    color: white;
    width: 100%;

`

export const SearchInput = styled.input `
    width: 100%;
    height: 60px;
    background-color: #191919;
    border: none;
    color: white;
    font-size: 20px;
    margin-left: 20px;

    &:focus{
        outline: none;
    }
`

export const SearchBar = styled.div `
    position: relative;
    background-color: #191919;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 70px;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    border-bottom: solid 1px white;
`

export const RenderArea = styled.div `
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
`

export const DescriptionArea = styled.div `
    width: 35%;
    background-color: #191919;
    color: white;
`

export const Page = styled.div `
    width : 100%;
    height : 100%;
    display: flex;
    overflow-x: hidden;
    overflow-y: hidden;
    font-family: sans-serif;
    background-color: black;
    a{
        text-decoration:none;
        color:inherit;
    }
    body{
        font-family: sans-serif;
        color:white;
        margin:0;
    }
`