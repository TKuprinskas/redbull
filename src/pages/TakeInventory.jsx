import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Calendar from 'react-calendar';
import { Container, Box, Typography, Button, TextField, Pagination, Tooltip } from '@mui/material';
import { getTokenFromStorage, getUserIdFromToken } from '../services/helpers';
import { getInventoryAsync, userAddInventoryAsync } from '../services/API';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import usePagination from '../components/Pagination';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment/moment';

const TakeInventory = () => {
    const isMobile = window.innerWidth < 600;
    const [inventory, setInventory] = useState([]);
    const [page, setPage] = useState(1);
    const PER_PAGE = isMobile ? 5 : 10;
    const count = Math.ceil(inventory.length / PER_PAGE);
    const _DATA = usePagination(inventory, PER_PAGE);
    const [cart, setCart] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const handleDateChange = (date, item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            const newCart = cart.map((i) => {
                if (i.id === item.id) {
                    return {
                        ...i,
                        reservedFrom: moment(date[0]).format('YYYY-MM-DD'),
                        reservedUntil: moment(date[1]).format('YYYY-MM-DD'),
                    };
                }
                return i;
            });
            setCart(newCart);
        } else {
            setCart([
                ...cart,
                {
                    ...item,
                    reservedFrom: moment(date[0]).format('YYYY-MM-DD'),
                    reservedUntil: moment(date[1]).format('YYYY-MM-DD'),
                },
            ]);
        }
        return;
    };

    const getReservedDate = (item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            const reservedFrom = cartItem.reservedFrom ? new Date(cartItem.reservedFrom) : new Date();
            const reservedUntil = cartItem.reservedUntil ? new Date(cartItem.reservedUntil) : new Date();
            return [reservedFrom, reservedUntil];
        } else {
            return [new Date(), new Date()];
        }
    };

    const handleSubmit = async () => {
        const token = getTokenFromStorage();
        const userId = getUserIdFromToken(token);
        const items = cart.map((i) => {
            return { id: i.id, count: i.count, reservedFrom: i.reservedFrom, reservedUntil: i.reservedUntil };
        });
        await userAddInventoryAsync(userId, items, token);
        setCart([]);
        setTotalCount(0);
        await getInventory();
    };

    const getTakenCount = (item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            return cartItem.count;
        }
        return 0;
    };

    useEffect(() => {
        getInventory();
    }, []);

    const getInventory = async () => {
        const token = getTokenFromStorage();
        const response = await getInventoryAsync(token);
        setInventory(response.data);
        setLoaded(true);
    };

    const handleIncrementDisable = (item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            return cartItem.count === item.quantityRemaining;
        }
        if (item.quantityRemaining === 0) {
            return true;
        }
        return false;
    };

    const handleDecrementDisable = (item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            return cartItem.count === 0;
        }
        return true;
    };

    const handleIncrement = (item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (!cartItem) {
            setCart([...cart, { ...item, count: 1 }]);
        } else {
            const newCart = cart.map((i) => {
                if (i.id === item.id) {
                    return { ...i, count: i.count + 1 < i.quantityRemaining ? i.count + 1 : i.quantityRemaining };
                }
                return i;
            });
            setCart(newCart);
        }
        setTotalCount(totalCount + 1);
    };

    const handleDecrement = (item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem.count > 0) {
            const newCart = cart.map((i) => {
                if (i.id === item.id) {
                    return { ...i, count: i.count - 1 };
                }
                return i;
            });
            setCart(newCart);
        }
        setTotalCount(totalCount - 1 >= 0 ? totalCount - 1 : 0);
    };

    const handlePageChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    const checkDisabled = () => {
        const cartItem = cart.find((i) => {
            const reservedFrom = i.reservedFrom ? i.reservedFrom : '';
            const reservedUntil = i.reservedUntil ? i.reservedUntil : '';
            return reservedFrom === '' || reservedUntil === '';
        });
        if (cartItem) {
            return true;
        } else if (totalCount === 0) {
            return true;
        } else {
            return false;
        }
    };

    if (!loaded) {
        return <h1>Kraunami duomenys..</h1>;
    }

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
            <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ typography: { xs: 'h6', md: 'h4' } }} component="div" gutterBottom>
                        J??s?? krep??elyje yra {totalCount} prek??s(-i??)
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                        disabled={checkDisabled() === true}
                        onClick={handleSubmit}
                    >
                        Paimti inventori??
                    </Button>
                </Box>
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
                    <Tooltip title="Pavadinimas" placement="top">
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
                    <Tooltip title="Imamas kiekis" placement="top">
                        <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                        >
                            <ShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                        </Typography>
                    </Tooltip>
                    <Tooltip title="Rezervuojama nuo-iki" placement="top">
                        <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                        >
                            <CalendarMonthOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
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
                                <ShoppingCartOutlinedIcon
                                    sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flex: 1,
                                        width: 0,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <Button
                                        onClick={() => handleDecrement(item)}
                                        disabled={handleDecrementDisable(item)}
                                    >
                                        <RemoveCircleOutlineOutlinedIcon />
                                    </Button>
                                    <TextField
                                        id="outlined-number"
                                        value={getTakenCount(item)}
                                        sx={{ width: 50, textAlign: 'center' }}
                                        disabled
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="outlined"
                                    />
                                    <Button
                                        onClick={() => handleIncrement(item)}
                                        disabled={handleIncrementDisable(item)}
                                    >
                                        <AddCircleOutlineOutlinedIcon />
                                    </Button>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: { xs: 0, md: 1 },
                                    width: { xs: 1, md: 0 },
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <CalendarMonthOutlinedIcon
                                    sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                />
                                <Box sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                                    <Calendar
                                        onChange={(date) => handleDateChange(date, item)}
                                        value={getReservedDate(item)}
                                        selectRange={true}
                                        minDate={new Date()}
                                        maxDate={new Date(new Date().setMonth(new Date().getMonth() + 6))}
                                        locale="lt"
                                        format="yyyy-MM-dd"
                                    />
                                </Box>
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

export default TakeInventory;
