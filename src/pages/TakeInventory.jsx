import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { getTokenFromStorage, getUserIdFromToken } from '../services/helpers';
import { getInventoryAsync, userAddInventoryAsync } from '../services/API';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

const TakeInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const handleSubmit = async () => {
        const token = getTokenFromStorage();
        const userId = getUserIdFromToken(token);
        const items = cart.map((i) => {
            return { id: i.id, count: i.count };
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
    };

    const handleIncrementDisable = (item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            return cartItem.count === item.quantity;
        }
        if (item.quantity === 0) {
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
                    return { ...i, count: i.count + 1 < i.quantity ? i.count + 1 : i.quantity };
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ typography: { xs: 'h6', md: 'h4' } }} component="div" gutterBottom>
                        Jūsų krepšelyje yra {totalCount} prekės(-ių)
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                        disabled={totalCount === 0}
                        onClick={handleSubmit}
                    >
                        Paimti inventorių
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
                        <ShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
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
                                    {item.quantity}
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
                        </Box>
                    ))}
            </Box>
        </Container>
    );
};

export default TakeInventory;