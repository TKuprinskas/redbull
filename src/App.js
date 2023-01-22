import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './services/privateRoute';
const SignIn = React.lazy(() => import('./pages/SignIn'));
const Home = React.lazy(() => import('./pages/Home'));

const App = () => {
    return (
        <div className="App">
            <div className="page-container">
                <div className="content-wrapper">
                    <Routes>
                        <Route path="/" element={<SignIn />} />
                        <Route
                            path="/home"
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default App;
