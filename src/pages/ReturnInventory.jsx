import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Tooltip,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { myInventory, returnCartItems, status } from '../state/selectors';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import usePagination from '../components/Pagination';
import { fetchMyInventory, postUserReturnInventory } from '../state/thunks';
import {
  incrementReturnItemCount,
  decrementReturnItemCount,
  resetReturnCartItems,
  addReturnCartItemComment,
  addReturnCartItemStatus,
  clearStates,
} from '../state/slice';
import moment from 'moment';
import { getTokenFromStorage, getUserIdFromToken } from '../services/helpers';

const ReturnInventory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector(myInventory);
  const cart = useSelector(returnCartItems);
  const invStatus = useSelector(status);
  const isMobile = window.innerWidth < 600;
  const [totalCount, setTotalCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = isMobile ? 10 : 20;
  const count = Math.ceil(inventory.length / PER_PAGE);
  const _DATA = usePagination(inventory, PER_PAGE);

  const dateTimeHandler = (dateTime) => {
    if (!dateTime) return 'Negrąžinta';
    const date = moment(dateTime).format('YYYY-MM-DD');
    const time = moment(dateTime).format('HH:mm');
    return `${date} ${time}`;
  };

  const handleReservedFromUntil = (from, until) => {
    if (!from && !until) return 'Negrąžinta';
    const fromDate = moment(from).format('YYYY-MM-DD');
    const untilDate = moment(until).format('YYYY-MM-DD');
    return `${fromDate} - ${untilDate}`;
  };

  const handleCommentChange = (item, comment) => {
    dispatch(addReturnCartItemComment({ id: item.id, comment }));
  };

  const countCartItems = () => {
    const count = cart.reduce((acc, item) => {
      return acc + item.count;
    }, 0);
    return count;
  };

  const handleSubmit = async () => {
    const token = getTokenFromStorage();
    const userId = getUserIdFromToken();
    const data = { userId, cart, token };
    const userToken = { userId, token };
    dispatch(postUserReturnInventory(data));
    setTimeout(() => {
      dispatch(resetReturnCartItems());
      dispatch(fetchMyInventory(userToken));
    }, 500);
  };

  const getTakenCount = (item) => {
    const cartItem = cart.find((i) => i.id === item.id);
    if (cartItem) {
      return cartItem.count;
    }
    return 0;
  };

  useEffect(() => {
    const token = getTokenFromStorage();
    const userId = getUserIdFromToken();
    const userToken = { userId, token };
    dispatch(fetchMyInventory(userToken));
  }, [dispatch]);

  useEffect(() => {
    if (invStatus === 'succeeded') {
      const count = inventory.reduce((acc, item) => {
        return acc + item.quantityRemaining;
      }, 0);
      setTotalCount(count);
      setLoaded(true);
    }
  }, [invStatus]);

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
    dispatch(incrementReturnItemCount(item));
    setTotalCount(totalCount - 1);
  };

  const handleDecrement = (item) => {
    dispatch(decrementReturnItemCount(item));
    setTotalCount(totalCount + 1);
  };

  const handleSelectChange = (e, item) => {
    dispatch(addReturnCartItemStatus({ id: item.id, status: e.target.value }));
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
      value: 'Nešvarus',
      label: 'Nešvarus',
    },
    {
      value: 'Sudaužytas',
      label: 'Sudaužytas',
    },
    {
      value: 'Įlenktas',
      label: 'Įlenktas',
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

  const handlePageChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  if (!loaded) {
    return <h1>Kraunami duomenys..</h1>;
  }

  return (
    <Container maxWidth='xxl' sx={{ m: { xs: 1, md: 2 } }}>
      <ToastContainer
        position='top-center'
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Typography
            sx={{ typography: { xs: 'h6', md: 'h4' } }}
            component='div'
            gutterBottom>
            Jūs esate negražinęs(-us) {totalCount} prekės(-ių)
          </Typography>
          <Button
            variant='contained'
            color='primary'
            sx={{ ml: 2 }}
            disabled={checkDisabled() === true}
            onClick={handleSubmit}>
            Grąžinti inventorių
          </Button>
        </Box>
        <Box
          sx={{
            mt: 2,
            display: { xs: 'none', md: 'flex' },
            width: '100%',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1976d2',
          }}>
          <Tooltip title='Nuotrauka' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <ImageOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Paėmimo data' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <CalendarMonthOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Rezervuota nuo - iki' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <DateRangeOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Pavadinimas' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <StorefrontOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Paimtas kiekis' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <ShoppingBasketOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Grąžinamas kiekis' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <ShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Grąžinta būklė' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <AssignmentLateOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Komentaras' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <ChatBubbleOutlineOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
        </Box>
        {inventory?.length > 0 &&
          _DATA
            .currentData()
            .sort((a, b) => (a.takenDateTime > b.takenDateTime ? -1 : 1))
            .map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  mt: 2,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  width: '100%',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #1976d2',
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    flex: { xs: 0, md: 1 },
                    width: { xs: 1, md: 0 },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Box
                    component='img'
                    sx={{
                      height: 200,
                      width: 200,
                      maxHeight: { xs: 120, md: 150, xxl: 200 },
                      maxWidth: { xs: 120, md: 150, xxl: 200 },
                      borderRadius: 5,
                      mb: 1,
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                    alt='redbull'
                    src={`https://redbullback.tenisopartneris.lt/public/images/${item.image}`}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flex: { xs: 0, md: 1 },
                    width: { xs: 1, md: 0 },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CalendarMonthOutlinedIcon
                    sx={{
                      mr: 1,
                      color: '#1976d2',
                      display: { xs: 'flex', md: 'none' },
                    }}
                  />
                  <Typography
                    variant='h6'
                    component='div'
                    gutterBottom
                    sx={{
                      flex: 1,
                      width: 0,
                      textAlign: 'center',
                      fontSize: { xs: 14, md: 16 },
                      marginBottom: 0,
                      padding: { xs: 0, md: 2 },
                    }}>
                    {dateTimeHandler(item.takenDateTime, item)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flex: { xs: 0, md: 1 },
                    width: { xs: 1, md: 0 },
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <DateRangeOutlinedIcon
                    sx={{
                      mr: 1,
                      color: '#1976d2',
                      display: { xs: 'flex', md: 'none' },
                    }}
                  />
                  <Typography
                    variant='h6'
                    component='div'
                    gutterBottom
                    sx={{
                      flex: 1,
                      width: 0,
                      textAlign: 'center',
                      fontSize: { xs: 14, md: 16 },
                      marginBottom: 0,
                      padding: { xs: 0, md: 2 },
                    }}>
                    {handleReservedFromUntil(
                      item.reservedFrom,
                      item.reservedUntil
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flex: { xs: 0, md: 1 },
                    width: { xs: 1, md: 0 },
                    alignItems: 'center',
                  }}>
                  <StorefrontOutlinedIcon
                    sx={{
                      mr: 1,
                      color: '#1976d2',
                      display: { xs: 'flex', md: 'none' },
                    }}
                  />
                  <Typography
                    variant='h6'
                    component='div'
                    gutterBottom
                    sx={{
                      flex: 1,
                      width: 0,
                      textAlign: 'center',
                      fontSize: { xs: 14, md: 16 },
                      marginBottom: 0,
                    }}>
                    {item.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flex: { xs: 0, md: 1 },
                    width: { xs: 1, md: 0 },
                    alignItems: 'center',
                  }}>
                  <ShoppingBasketOutlinedIcon
                    sx={{
                      mr: 1,
                      color: '#1976d2',
                      display: { xs: 'flex', md: 'none' },
                    }}
                  />
                  <Typography
                    variant='h6'
                    component='div'
                    gutterBottom
                    sx={{
                      flex: 1,
                      width: 0,
                      textAlign: 'center',
                      fontSize: { xs: 14, md: 16 },
                      marginBottom: 0,
                    }}>
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
                  }}>
                  <ShoppingCartOutlinedIcon
                    sx={{
                      mr: 1,
                      color: '#1976d2',
                      display: { xs: 'flex', md: 'none' },
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      width: { xs: 1, md: 170 },
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 1,
                    }}>
                    <Button
                      onClick={() => handleDecrement(item)}
                      disabled={handleDecrementDisable(item)}>
                      <RemoveCircleOutlineOutlinedIcon />
                    </Button>
                    <TextField
                      id='outlined-number'
                      value={getTakenCount(item)}
                      sx={{
                        minWidth: 40,
                        maxWidth: { xs: 40, md: 60 },
                        textAlign: 'center',
                      }}
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant='outlined'
                    />
                    <Button
                      onClick={() => handleIncrement(item)}
                      disabled={handleIncrementDisable(item)}>
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
                  }}>
                  <AssignmentLateOutlinedIcon
                    sx={{
                      mr: 1,
                      color: '#1976d2',
                      display: { xs: 'flex', md: 'none' },
                    }}
                  />
                  <Select
                    labelId='status'
                    id='status'
                    value={getValue(item)}
                    onChange={(e) => handleSelectChange(e, item)}
                    sx={{
                      width: { xs: '100%', md: 'auto', textAlign: 'center' },
                    }}>
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
                  }}>
                  <ChatBubbleOutlineOutlinedIcon
                    sx={{
                      mr: 1,
                      color: '#1976d2',
                      display: { xs: 'flex', md: 'none' },
                    }}
                  />
                  {checkIfCommentIsNeeded(item) && (
                    <TextField
                      margin='normal'
                      fullWidth
                      name='comment'
                      label='Komentaras'
                      type='text'
                      id='comment'
                      autoComplete='comment'
                      onChange={(e) =>
                        handleCommentChange(item, e.target.value)
                      }
                      sx={{ mb: 2 }}
                    />
                  )}
                </Box>
              </Box>
            ))}
      </Box>
      <Pagination
        count={count}
        size='large'
        page={page}
        variant='outlined'
        shape='rounded'
        onChange={handlePageChange}
        sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};

export default ReturnInventory;
