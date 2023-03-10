import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container, Box, Typography, Button, TextField, Tooltip, Select, MenuItem } from '@mui/material';
import { getTokenFromStorage, getUserIdFromToken } from '../services/helpers';
import { myInventoryAsync, returnInventoryAsync } from '../services/API';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import moment from 'moment';

const ReturnInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [cart, setCart] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const handleCommentChange = (item, comment) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            cartItem.comment = comment;
            setCart([...cart]);
        } else {
            const newItem = { ...item, count: 1, comment };
            setCart([...cart, newItem]);
        }
    };

    const countCartItems = () => {
        const count = cart.reduce((acc, item) => {
            return acc + item.count;
        }, 0);
        return count;
    };

    const handleSubmit = async () => {
        const token = getTokenFromStorage();
        const userId = getUserIdFromToken(token);
        const items = cart.map((i) => {
            const date = moment(i.takenDateTime).format('YYYY-MM-DD');
            const time = moment(i.takenDateTime).format('HH:mm');
            const takenDateTime = `${date} ${time}`;
            return {
                id: i.id,
                inventoryId: i.inventoryId,
                count: i.count,
                status: i.status ? i.status : '',
                comment: i.comment ? i.comment : '',
                takenDateTime: takenDateTime,
            };
        });
        await returnInventoryAsync(userId, items, token);
        setCart([]);
        getInventory();
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
        const userId = getUserIdFromToken();
        const response = await myInventoryAsync(userId, token);
        setInventory(response.data);
        const count = response.data.reduce((acc, item) => {
            return acc + item.quantityRemaining;
        }, 0);
        setTotalCount(count);
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
            setCart([...cart, { ...item, count: 1, takenDateTime: item.takenDateTime }]);
        } else {
            const newCart = cart.map((i) => {
                if (i.id === item.id) {
                    return { ...i, count: i.count + 1 < i.quantityRemaining ? i.count + 1 : i.quantityRemaining };
                }
                return i;
            });
            setCart(newCart);
        }
        setTotalCount(totalCount - 1);
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
        setTotalCount(totalCount + 1);
    };

    const handleSelectChange = (e, item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            cartItem.status = e.target.value;
            setCart([...cart]);
        } else {
            const newItem = { ...item, count: 1, status: e.target.value };
            setCart([...cart, newItem]);
        }
    };

    const getValue = (item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            return cartItem.status;
        }
        return '';
    };

    const checkIfCommentIsNeeded = (item) => {
        const cartItem = cart.find((i) => i.id === item.id);
        if (cartItem) {
            return cartItem.status !== 'OK' && cartItem.status !== '';
        }
        return false;
    };

    const message = [
        {
            value: 'OK',
            label: 'OK',
        },
        {
            value: 'Ne??varus',
            label: 'Ne??varus',
        },
        {
            value: 'Sudau??ytas',
            label: 'Sudau??ytas',
        },
        {
            value: '??lenktas',
            label: '??lenktas',
        },
        {
            value: 'Kita',
            label: 'Kita',
        },
    ];

    const checkDisabled = () => {
        const cartItem = cart.find((i) => i.status !== 'OK' && i.status !== '');
        if (cartItem && !cartItem.comment && countCartItems() > 0) {
            return true;
        } else if (countCartItems() === 0) {
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
                        J??s esate negra??in??s(-us) {totalCount} prek??s(-i??)
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                        disabled={checkDisabled() === true}
                        onClick={handleSubmit}
                    >
                        Gr????inti inventori??
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
                    <Tooltip title="Paimtas kiekis" placement="top">
                        <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                        >
                            <ShoppingBasketOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                        </Typography>
                    </Tooltip>
                    <Tooltip title="Gr????inamas kiekis" placement="top">
                        <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                        >
                            <ShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                        </Typography>
                    </Tooltip>
                    <Tooltip title="Gr????inta b??kl??" placement="top">
                        <Typography
                            variant="h6"
                            component="div"
                            gutterBottom
                            sx={{ flex: 1, width: 0, textAlign: 'center' }}
                        >
                            <AssignmentLateOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
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
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mb: 1,
                                }}
                            >
                                <AssignmentLateOutlinedIcon
                                    sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                />
                                <Select
                                    labelId="status"
                                    id="status"
                                    value={getValue(item)}
                                    onChange={(e) => handleSelectChange(e, item)}
                                    sx={{ width: { xs: '100%', md: 'auto', textAlign: 'center' } }}
                                >
                                    {message.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flex: { xs: 0, md: 1 },
                                    width: { xs: 1, md: 0 },
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mb: 1,
                                }}
                            >
                                <ChatBubbleOutlineOutlinedIcon
                                    sx={{ mr: 1, color: '#1976d2', display: { xs: 'flex', md: 'none' } }}
                                />
                                {checkIfCommentIsNeeded(item) && (
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        name="comment"
                                        label="Komentaras"
                                        type="text"
                                        id="comment"
                                        autoComplete="comment"
                                        onChange={(e) => handleCommentChange(item, e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            </Box>
                        </Box>
                    ))}
            </Box>
        </Container>
    );
};

export default ReturnInventory;
