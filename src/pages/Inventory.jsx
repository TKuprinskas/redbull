import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container, Box, Typography, Pagination, Tooltip } from '@mui/material';
import { getTokenFromStorage } from '../services/helpers';
import { getInventoryAsync } from '../services/API';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import usePagination from '../components/Pagination';

const UserInventory = () => {
    const isMobile = window.innerWidth < 600;
    const [inventory, setInventory] = useState([]);
    const [page, setPage] = useState(1);
    const PER_PAGE = isMobile ? 5 : 10;
    const count = Math.ceil(inventory.length / PER_PAGE);
    const _DATA = usePagination(inventory, PER_PAGE);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getInventory();
    }, []);

    const getInventory = async () => {
        const token = getTokenFromStorage();
        const response = await getInventoryAsync(token);
        setInventory(response.data);
        setLoaded(true);
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
                    <Tooltip title="Nuotrauka" placement="top">
                        <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                        >
                            <ImageOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                        </Typography>
                    </Tooltip>
                    <Tooltip title="Produktas" placement="top">
                        <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                        >
                            <StorefrontOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                        </Typography>
                    </Tooltip>
                    <Tooltip title="Esamas likutis" placement="top">
                        <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                        >
                            <ShoppingBasketOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                        </Typography>
                    </Tooltip>
                    <Tooltip title="Komentaras" placement="top">
                        <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                        >
                            <ChatBubbleOutlineOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                        </Typography>
                    </Tooltip>
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
