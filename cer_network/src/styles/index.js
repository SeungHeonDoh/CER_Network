import styled from 'styled-components'

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
        background-color: rgba( 255, 255, 255, 0.5 );
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
    width: 700px;
    z-index: 1200;
    background-color: #191919;
    top: 0px;
    position: relative;
    color: white;
`

export const Page = styled.div `
    display: flex;
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;
`

export const contentsContainer = styled.div `
    width : 90%;
    height : 90%;
`

export const subContents = styled.div `
    opacity: 0.5;
    font-family: AppleSDGothicNeo;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
`

export const mainContents = styled.div `
    font-family: AppleSDGothicNeo;
    font-size: 24px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
`

export const HeaderContainer = styled.div`
    width : 90%:

`
export const Header = styled.div`
    display: flex;
`

export const ImageContainer = styled.div`
    url = ${props => props.bgUrl}
`

export const MainImage = styled.div`
    url = ${props => props.imageUrl}
    z-index : 2
`

export const BackgroundImage = styled.div`
    url = ${props => props.backimgUrl}
    z-index : 1
`