import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './services/privateRoute';
const SignIn = React.lazy(() => import('./pages/SignIn'));
const Home = React.lazy(() => import('./pages/Home'));

const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route
          path='/home'
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
