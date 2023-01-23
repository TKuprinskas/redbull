import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container, Box, Typography, Pagination } from '@mui/material';
import { getTokenFromStorage } from '../services/helpers';
import { getInventoryAsync } from '../services/API';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import usePagination from '../components/Pagination';

const UserInventory = () => {
    const isMobile = window.innerWidth < 600;
    const [inventory, setInventory] = useState([]);
    const [page, setPage] = useState(1);
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

    const handlePageChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
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
                                    {item.quantityRemaining}
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
                        </Box>
                    ))}
            </Box>
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

export default UserInventory;
