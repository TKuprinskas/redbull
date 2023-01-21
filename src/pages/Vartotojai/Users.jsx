import React, { useState } from 'react';
import { Container, Box, Button } from '@mui/material';
import UsersList from './UsersList';
import CreateUsers from './CreateUsers';

const Users = () => {
    const [currentView, setCurrentView] = useState('usersList');

    const changeView = () => {
        setCurrentView('userCreate');
    };

    return (
        <Container maxWidth="lg" sx={{ m: { xs: 1, md: 2 } }}>
            {currentView === 'usersList' && (
                <>
                    <Box sx={{ flexGrow: 1, width: '100%' }}>
                        <Button variant="contained" sx={{ mb: 2 }} onClick={() => changeView()}>
                            Sukurti vartotoją
                        </Button>
                    </Box>
                    <UsersList />
                </>
            )}
            {currentView === 'userCreate' && <CreateUsers setCurrentView={setCurrentView} />}
        </Container>
    );
};

export default Users;
