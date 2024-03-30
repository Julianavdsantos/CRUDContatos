import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    font-family: 'poppins', sans-serif;
  }
  
  body {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    background-color: #C5EBAA;
  }

 table{
  background-color: #8a2be2;
 }

 .pagination{
  color: #C5EBAA;
 
 }



`;

export default Global;