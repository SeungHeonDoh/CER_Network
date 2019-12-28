import styled from 'styled-components'



export const SearchItem = styled.div `

    padding: 10px;
    background-color: rgb(26, 26, 26, 0.5);
    border-bottom: solid 1px white;
    width: 100%;

    &:hover{
        background-color: #000000;
        background-color: rgba( 255, 255, 255, 0.5 );
    }

`
export const SearchResults = styled.div `
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