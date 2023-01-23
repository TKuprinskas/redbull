import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Container, Box, Typography, Button } from '@mui/material';
import AddInventory from './AddInventory';
import { getTokenFromStorage } from '../../../services/helpers';
import { deleteInventoryAsync, getInventoryAsync } from '../../../services/API';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EditInventory from './EditInventory';

const AdminInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [view, setView] = useState('inventoryList');
    const [selectedItem, setSelectedItem] = useState();

    useEffect(() => {
        getInventory();
    }, []);

    const getInventory = async () => {
        const token = getTokenFromStorage();
        const response = await getInventoryAsync(token);
        setInventory(response.data);
    };

    const handleEditInventory = (item) => {
        setView('editInventory');
        setSelectedItem(item);
    };

    const handleDeleteInventory = async (id) => {
        const token = getTokenFromStorage();
        await deleteInventoryAsync(token, id);
        setTimeout(() => {
            getInventory();
            setView('inventoryList');
        }, 1500);
    };

    const changeView = () => {
        setView('addInventory');
    };

    const confirmDelete = (id) => {
        confirmAlert({
            title: '',
            message: 'Ar tikrai norite ištrinti vartotoją?',
            buttons: [
                {
                    label: 'Taip',
                    onClick: () => handleDeleteInventory(id),
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
            {view === 'inventoryList' && (
                <>
                    <Box sx={{ flexGrow: 1, width: '100%' }}>
                        <Button variant="contained" sx={{ mb: 2 }} onClick={() => changeView()}>
                            <AddShoppingCartOutlinedIcon /> &nbsp; Pridėti inventorių
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
                                <StorefrontOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <ShoppingBasketOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <ChatBubbleOutlineOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <ShoppingCartCheckoutOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <RemoveShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                        </Box>
                        {inventory.length > 0 &&
                            inventory.map((item) => (
                                <Box
                                    key={item.id}
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
                                        <StorefrontOutlinedIcon
                                            sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            gutterBottom
                                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                        >
                                            {item.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flex: { xs: 0, md: 1 }, width: { xs: 1, md: 0 } }}>
                                        <ShoppingBasketOutlinedIcon
                                            sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            gutterBottom
                                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                        >
                                            {item.quantity}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flex: { xs: 0, md: 1 }, width: { xs: 1, md: 0 } }}>
                                        <ChatBubbleOutlineOutlinedIcon
                                            sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            gutterBottom
                                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                        >
                                            {item.comment}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flex: { xs: 0, md: 1 }, width: { xs: 1, md: 0 } }}>
                                        <ShoppingCartCheckoutOutlinedIcon
                                            sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                        />
                                        <Box sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                                            <Button
                                                variant="contained"
                                                sx={{ mb: 2 }}
                                                onClick={() => handleEditInventory(item)}
                                            >
                                                Redaguoti
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', flex: { xs: 0, md: 1 }, width: { xs: 1, md: 0 } }}>
                                        <RemoveShoppingCartOutlinedIcon
                                            sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                        />
                                        <Box sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                                            <Button
                                                variant="contained"
                                                sx={{ mb: 2 }}
                                                onClick={() => confirmDelete(item.id)}
                                            >
                                                Ištrinti
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                    </Box>
                </>
            )}
            {view === 'addInventory' && <AddInventory setView={setView} getInventory={getInventory} />}
            {view === 'editInventory' && (
                <EditInventory setView={setView} getInventory={getInventory} selectedItem={selectedItem} />
            )}
        </Container>
    );
};

export default AdminInventory;
