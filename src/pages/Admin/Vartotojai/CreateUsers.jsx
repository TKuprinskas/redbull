import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserAsync } from '../../../services/API';
import { getTokenFromStorage } from '../../../services/helpers';
import { fetchAllUsers } from '../../../state/thunks';

const theme = createTheme();

const CreateUsers = ({ setView }) => {
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const token = getTokenFromStorage();
        await createUserAsync(data.get('username'), data.get('password'), token);
        setTimeout(() => {
            dispatch(fetchAllUsers(token));
            setView('usersList');
        }, 1500);
    };

    const changeView = () => {
        setView('usersList');
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xs" sx={{ m: { xs: 1, md: 2 } }}>
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
                <Box sx={{ flexGrow: 1, width: '100%' }}>
                    <Button variant="contained" sx={{ mb: 2 }} onClick={() => changeView()}>
                        Grįžti atgal
                    </Button>
                </Box>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Vartotojo kūrimas
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={password.length < 5}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText={password.length < 5 ? 'Slaptažodis turi būti bent 5 simbolių ilgio' : ''}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={password.length < 5}
                        >
                            Sukurti vartotoją
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default CreateUsers;
