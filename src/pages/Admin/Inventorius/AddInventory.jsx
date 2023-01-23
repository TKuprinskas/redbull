import React from 'react';
import { ToastContainer } from 'react-toastify';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { addInventoryAsync } from '../../../services/API';
import { getTokenFromStorage } from '../../../services/helpers';

const theme = createTheme();

const AddInventory = ({ setView, getInventory }) => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const token = getTokenFromStorage();
        await addInventoryAsync(data.get('name'), data.get('quantityAdded'), data.get('comment'), token);
        setTimeout(() => {
            setView('inventoryList');
            getInventory();
        }, 1500);
    };

    const changeView = () => {
        setView('inventoryList');
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
                        Pridėti inventorių
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Pavadinimas"
                            name="name"
                            autoComplete="name"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="quantityAdded"
                            label="Kiekis"
                            type="number"
                            id="quantityAdded"
                            autoComplete="quantityAdded"
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="comment"
                            label="Komentaras"
                            type="text"
                            id="comment"
                            autoComplete="comment"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Pridėti
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default AddInventory;
