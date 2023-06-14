import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './state/store';
import App from './App';
import './index.css';
import 'normalize.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </Suspense>
);
