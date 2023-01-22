import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Container, Box, Typography, Button } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RememberMeOutlinedIcon from '@mui/icons-material/RememberMeOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';
import ResetPassword from './ResetPassword';
import CreateUsers from './CreateUsers';
import { getTokenFromStorage } from '../../services/helpers';
import { deleteUserAsync, getUsersAsync } from '../../services/API';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [view, setView] = useState('usersList');
    const [selectedUser, setSelectedUser] = useState();

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const token = getTokenFromStorage();
        const data = await getUsersAsync(token);
        setUsers(data);
    };

    const handleResetPassword = (user) => {
        setView('resetPassword');
        setSelectedUser(user);
    };

    const handleDeleteUser = async (id) => {
        const token = getTokenFromStorage();
        await deleteUserAsync(token, id);
        setTimeout(() => {
            getUsers();
            setView('usersList');
        }, 1500);
    };

    const changeView = () => {
        setView('userCreate');
    };

    const confirmDelete = (id) => {
        confirmAlert({
            title: '',
            message: 'Ar tikrai norite ištrinti vartotoją?',
            buttons: [
                {
                    label: 'Taip',
                    onClick: () => handleDeleteUser(id),
                },
                {
                    label: 'Ne',
                },
            ],
        });
    };

    return (
        <Container maxWidth="lg" sx={{ m: { xs: 1, md: 2 } }}>
            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {view === 'usersList' && (
                <>
                    <Box sx={{ flexGrow: 1, width: '100%' }}>
                        <Button variant="contained" sx={{ mb: 2 }} onClick={() => changeView()}>
                            Sukurti vartotoją
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, width: '100%' }}>
                        <Box
                            sx={{
                                mt: 2,
                                display: { xs: 'none', md: 'flex' },
                                width: '100%',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #1976d2',
                            }}
                        >
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <PersonOutlineOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <RememberMeOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <LockResetOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <PersonRemoveAlt1OutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                        </Box>
                        {users.map((user) => (
                            <Box
                                key={user.id}
                                sx={{
                                    mt: 2,
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid #1976d2',
                                }}
                            >
                                <Box sx={{ display: 'flex', flex: { xs: 0, md: 1 }, width: { xs: 1, md: 0 } }}>
                                    <PersonOutlineOutlinedIcon
                                        sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                    />
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        gutterBottom
                                        sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                    >
                                        {user.username}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flex: { xs: 0, md: 1 }, width: { xs: 1, md: 0 } }}>
                                    <RememberMeOutlinedIcon
                                        sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                    />
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        gutterBottom
                                        sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                    >
                                        {user.role}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flex: { xs: 0, md: 1 }, width: { xs: 1, md: 0 } }}>
                                    <LockResetOutlinedIcon
                                        sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                    />
                                    <Box sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                                        <Button
                                            variant="contained"
                                            sx={{ mb: 2 }}
                                            onClick={() => handleResetPassword(user)}
                                        >
                                            Pakeisti slaptažodį
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flex: { xs: 0, md: 1 }, width: { xs: 1, md: 0 } }}>
                                    <PersonRemoveAlt1OutlinedIcon
                                        sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                    />
                                    <Box sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                                        <Button
                                            variant="contained"
                                            sx={{ mb: 2 }}
                                            onClick={() => confirmDelete(user.id)}
                                        >
                                            Ištrinti vartotoją
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </>
            )}
            {view === 'userCreate' && <CreateUsers setView={setView} getUsers={getUsers()} />}
            {view === 'resetPassword' && <ResetPassword setView={setView} selectedUser={selectedUser} />}
        </Container>
    );
};

export default Users;
