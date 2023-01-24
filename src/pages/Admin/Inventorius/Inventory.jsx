import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Container, Box, Typography, Button, Pagination } from '@mui/material';
import AddInventory from './AddInventory';
import { getTokenFromStorage } from '../../../services/helpers';
import { deleteInventoryAsync, getInventoryAsync } from '../../../services/API';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EditInventory from './EditInventory';
import usePagination from '../../../components/Pagination';

const AdminInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [view, setView] = useState('inventoryList');
    const [selectedItem, setSelectedItem] = useState();
    const [page, setPage] = useState(1);
    const isMobile = window.innerWidth < 600;
    const PER_PAGE = isMobile ? 5 : 10;
    const count = Math.ceil(inventory.length / PER_PAGE);
    const _DATA = usePagination(inventory, PER_PAGE);

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

    const handlePageChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    return (
        <Container maxWidth="xl" sx={{ m: { xs: 1, md: 2 } }}>
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
                                <ImageOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
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
                                <ShoppingCartCheckoutOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <ShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <RemoveShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
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
                                <EditOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                            <Typography
                                variant="h6"
                                component="div"
                                gutterBottom
                                sx={{ flex: 1, width: 0, textAlign: 'center' }}
                            >
                                <DeleteForeverOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                            </Typography>
                        </Box>
                        {inventory.length > 0 &&
                            _DATA.currentData().map((item) => (
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
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flex: { xs: 0, md: 1 },
                                            width: { xs: 1, md: 0 },
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            sx={{
                                                height: 200,
                                                width: 200,
                                                maxHeight: { xs: 150, md: 170 },
                                                maxWidth: { xs: 220, md: 250 },
                                                borderRadius: 5,
                                                mb: 1,
                                            }}
                                            alt="redbull"
                                            src={`https://backend.tenisopartneris.lt/public/redbull/${item.image}`}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flex: { xs: 0, md: 1 },
                                            width: { xs: 1, md: 0 },
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
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
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flex: { xs: 0, md: 1 },
                                            width: { xs: 1, md: 0 },
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <ShoppingCartOutlinedIcon
                                            sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            gutterBottom
                                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                        >
                                            {item.quantityAdded}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flex: { xs: 0, md: 1 },
                                            width: { xs: 1, md: 0 },
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <StorefrontOutlinedIcon
                                            sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            gutterBottom
                                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                        >
                                            {item.quantityRemaining}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flex: { xs: 0, md: 1 },
                                            width: { xs: 1, md: 0 },
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <RemoveShoppingCartOutlinedIcon
                                            sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                        />
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            gutterBottom
                                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                                        >
                                            {item.quantityTaken}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flex: { xs: 0, md: 1 },
                                            width: { xs: 1, md: 0 },
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
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
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flex: { xs: 0, md: 1 },
                                            width: { xs: 1, md: 0 },
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <EditOutlinedIcon
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
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flex: { xs: 0, md: 1 },
                                            width: { xs: 1, md: 0 },
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <DeleteForeverOutlinedIcon
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

export default AdminInventory;
