import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'normalize.css';
import { GlobalStyle } from './styles';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
            <GlobalStyle />
            <App />
        </BrowserRouter>
    </Suspense>
);
