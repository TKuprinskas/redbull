import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Container, Box, Typography, Button, Pagination, Tooltip } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RememberMeOutlinedIcon from '@mui/icons-material/RememberMeOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ResetPassword from './ResetPassword';
import CreateUsers from './CreateUsers';
import { getTokenFromStorage } from '../../../services/helpers';
import { deleteUserAsync, getUsersAsync } from '../../../services/API';
import usePagination from '../../../components/Pagination';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [view, setView] = useState('usersList');
    const [selectedUser, setSelectedUser] = useState();
    const isMobile = window.innerWidth < 600;
    const [page, setPage] = useState(1);
    const PER_PAGE = isMobile ? 5 : 10;
    const count = Math.ceil(users.length / PER_PAGE);
    const _DATA = usePagination(users, PER_PAGE);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const token = getTokenFromStorage();
        const data = await getUsersAsync(token);
        setUsers(data);
        setLoaded(true);
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

    const handlePageChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    if (!loaded) {
        return <h1>Kraunami duomenys..</h1>;
    }

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
                            <PersonAddAltOutlinedIcon /> &nbsp; Sukurti vartotoją
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
                            <Tooltip title="Vartotojo vardas" placement="top">
                                <Typography
                                    variant="h6"
                                    component="div"
                                    gutterBottom
                                    sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                >
                                    <PersonOutlineOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                                </Typography>
                            </Tooltip>
                            <Tooltip title="Rolė" placement="top">
                                <Typography
                                    variant="h6"
                                    component="div"
                                    gutterBottom
                                    sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                >
                                    <RememberMeOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                                </Typography>
                            </Tooltip>
                            <Tooltip title="Slaptažodžio atstatymas" placement="top">
                                <Typography
                                    variant="h6"
                                    component="div"
                                    gutterBottom
                                    sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                >
                                    <LockResetOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                                </Typography>
                            </Tooltip>
                            <Tooltip title="Vartotojo ištrynimas" placement="top">
                                <Typography
                                    variant="h6"
                                    component="div"
                                    gutterBottom
                                    sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                >
                                    <PersonRemoveAlt1OutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                                </Typography>
                            </Tooltip>
                        </Box>
                        {users.length > 0 &&
                            _DATA.currentData().map((user) => (
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
            {view === 'userCreate' && <CreateUsers setView={setView} />}
            {view === 'resetPassword' && <ResetPassword setView={setView} selectedUser={selectedUser} />}
            <Pagination
                count={count}
                size="large"
                page={page}
                variant="outlined"
                shape="rounded"
                onChange={handlePageChange}
                sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}
            />
        </Container>
    );
};

export default Users;
