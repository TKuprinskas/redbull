import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`


  body {
    background-color: #fff;
    font-family: 'Montserrat', sans-serif;
    display: flex;
    flex-direction: column;
  }

    @media (max-width: 768px) {
        body {
            width: 100%;
            left: 0;
        }
    }
`;
