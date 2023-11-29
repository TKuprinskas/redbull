import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import Calendar from 'react-calendar';
import { useLocation } from 'react-router-dom';
import { Container, Box, Typography, Button, TextField, Pagination, Tooltip, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { takeCartItems, inventoryItems, checkedDates, reservedItemsFromUntil } from '../state/selectors';
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
import { fetchInventory, postUserTakeInventory, fetchCheckDates } from '../state/thunks';
import {
  incrementTakeItemCount,
  decrementTakeItemCount,
  setTakeCartItemDateFromTo,
  resetTakeCartItems,
  checkDates,
  updateCartItemCount,
  clearStates,
  addItemPurpose,
  addItemPurposeComment,
} from '../state/slice';
import { getTokenFromStorage, getUserIdFromToken } from '../services/helpers';

const message = [
  {
    value: 'Rėmimas',
    label: 'Rėmimas',
  },
  {
    value: 'Skolinimas',
    label: 'Skolinimas',
  },
];

const TakeInventory = () => {
  const isMobile = window.innerWidth < 600;
  const dispatch = useDispatch();
  const inventory = useSelector(inventoryItems);
  const cart = useSelector(takeCartItems);
  const checkingDates = useSelector(checkedDates);
  const reservedItems = useSelector(reservedItemsFromUntil);
  const [page, setPage] = useState(1);
  const PER_PAGE = isMobile ? 10 : 20;
  const count = Math.ceil(inventory?.length / PER_PAGE);
  const _DATA = usePagination(inventory, PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const topRef = useRef(null);
  const [isRedbullInCart, setIsRedbullInCart] = useState(false);
  const redbullProductsIds = [37, 38];
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredInventory = inventory.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelectChange = (e, item) => {
    dispatch(addItemPurpose({ id: item.id, purpose: e.target.value }));
  };

  const handleCommentChange = (item, comment) => {
    dispatch(addItemPurposeComment({ id: item.id, purposeComment: comment }));
  };

  const getValue = (item) => {
    const cartItem = cart.find((i) => i.id === item.id);
    if (cartItem) {
      return cartItem.purpose;
    }
    return '';
  };

  useEffect(() => {
    const redbullProducts = [
      {
        id: 37,
        name: 'Red Bull',
      },
      {
        id: 38,
        name: 'Red Bull Sugarfree',
      },
    ];
    const isRedbullInCart = cart.some((item) => redbullProducts.some((product) => product.id === item.id));
    setIsRedbullInCart(isRedbullInCart);
  }, [cart]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const countReservedItems = (item) => {
    const checkAvailability = reservedItems?.find((i) => i.id === item.id);
    if (checkAvailability) {
      let count = 0;
      reservedItems?.forEach((x) => {
        if (x.id === item.id) {
          count += x.quantityRemaining;
        }
      });
      const balance = item.quantityRemaining - count;
      return balance;
    }
    return item.quantityRemaining;
  };

  const handleDateChange = (date, item) => {
    const todaysDate = moment(new Date()).format('YYYY-MM-DD');
    const isReservationInFuture = moment(date[0]).isAfter(moment(todaysDate));
    dispatch(
      setTakeCartItemDateFromTo({
        id: item.id,
        productId: item.product_id,
        reservedFrom: moment(date[0]).format('YYYY-MM-DD'),
        reservedUntil: moment(date[1]).format('YYYY-MM-DD'),
        isTaken: isReservationInFuture ? false : true,
        isReserved: isReservationInFuture ? true : false,
      })
    );
    dispatch(
      checkDates([
        {
          id: item.id,
          reservedFrom: moment(date[0]).format('YYYY-MM-DD'),
          reservedUntil: moment(date[1]).format('YYYY-MM-DD'),
        },
      ])
    );

    const checkDatesObject = {
      id: item.id,
      reservedFrom: moment(date[0]).format('YYYY-MM-DD'),
      reservedUntil: moment(date[1]).format('YYYY-MM-DD'),
    };
    const token = getTokenFromStorage();
    const data = { checkDatesObject, token };
    dispatch(
      fetchCheckDates(data, () => {
        console.log('success');
      })
    );

    return;
  };

  const getReservedDate = (item) => {
    const cartItem = cart.find((i) => i.id === item.id);
    const checkDate = checkingDates.find((i) => i.id === item.id);
    if (cartItem) {
      const reservedFrom = cartItem.reservedFrom ? new Date(cartItem.reservedFrom) : new Date();
      const reservedUntil = cartItem.reservedUntil ? new Date(cartItem.reservedUntil) : new Date();
      return [reservedFrom, reservedUntil];
    } else if (checkDate) {
      const reservedFrom = checkDate.reservedFrom ? new Date(checkDate.reservedFrom) : new Date();
      const reservedUntil = checkDate.reservedUntil ? new Date(checkDate.reservedUntil) : new Date();
      return [reservedFrom, reservedUntil];
    } else {
      return [new Date(), new Date()];
    }
  };

  const handleSubmit = async () => {
    const token = getTokenFromStorage();
    const userId = getUserIdFromToken();
    const updatedCart = cart.map((item) => {
      if (redbullProductsIds.includes(item.id)) {
        if (item.purpose === 'Rėmimas') {
          return { ...item, isSponsored: 1, isLended: 0 };
        } else if (item.purpose === 'Skolinimas') {
          return { ...item, isLended: 1, isSponsored: 0 };
        }
      }
      return item;
    });

    const data = { userId, cart: updatedCart, token };
    dispatch(postUserTakeInventory(data));
    setTimeout(() => {
      dispatch(resetTakeCartItems());
      dispatch(clearStates());
      dispatch(fetchInventory(token));
    }, 500);
    setTotalCount(0);
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
    dispatch(fetchInventory(token));
    setTimeout(() => {
      setLoaded(true);
    }, 200);
  }, [dispatch]);

  const handleIncrementDisable = (item) => {
    const cartItem = cart.find((i) => i.id === item.id);
    if (cartItem) {
      return cartItem.count === countReservedItems(item);
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
    dispatch(incrementTakeItemCount(item));
    setTotalCount(totalCount + 1);
  };

  const handleDecrement = (item) => {
    dispatch(decrementTakeItemCount(item));
    setTotalCount(totalCount - 1 >= 0 ? totalCount - 1 : 0);
  };

  const handlePageChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkDisabled = () => {
    const cartItem = cart.find((i) => {
      const reservedFrom = i.reservedFrom ? i.reservedFrom : '';
      const reservedUntil = i.reservedUntil ? i.reservedUntil : '';
      return !redbullProductsIds.includes(i.id) && (reservedFrom === '' || reservedUntil === '');
    });

    const redbullItem = cart.find((i) => {
      const purpose = i.purpose ? i.purpose : '';
      const purposeComment = i.purposeComment ? i.purposeComment : '';
      return redbullProductsIds.includes(i.id) && (purpose === '' || purposeComment === '');
    });

    if (cartItem || redbullItem) {
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

  const dataToRender = searchTerm === '' ? _DATA.currentData() : filteredInventory;

  return (
    <>
      <Container maxWidth='xxl' sx={{ m: { xs: 1, md: 2 } }} ref={topRef}>
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
        <Box
          sx={{
            backgroundColor: '#fff',
            position: 'fixed',
            top: { xs: '56px', md: '64px' },
            left: { xs: '16px', md: '300px' },
            right: { xs: '16px', md: '30px' },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: { xs: '82px', md: '64px' },
            zIndex: 1,
          }}
        >
          <Typography sx={{ typography: { xs: 'h6', md: 'h4' } }} component='div' gutterBottom>
            Jūsų krepšelyje yra{' '}
            <Box as='span' sx={{ fontWeight: 'bold' }}>
              {totalCount}
            </Box>{' '}
            prekės(-ių)
          </Typography>
          <Button variant='contained' color='primary' sx={{ ml: 2 }} disabled={checkDisabled() === true} onClick={handleSubmit}>
            Paimti inventorių
          </Button>
        </Box>
        <Box
          sx={{
            backgroundColor: '#fff',
            position: 'fixed',
            top: { xs: '128px', md: '128px' },
            left: { xs: '16px', md: '300px' },
            right: { xs: '16px', md: '0' },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: { xs: '82px', md: '64px' },
            zIndex: 1,
          }}
        >
          <TextField id='search' label='Paieška' variant='outlined' onChange={handleSearchChange} sx={{ width: { xs: '100%', md: '20%' } }} />
        </Box>
        <Box sx={{ flexGrow: 1, width: '100%', marginTop: '128px' }}>
          <Box
            sx={{
              mt: 2,
              display: { xs: 'none', md: 'flex' },
              width: '100%',
              justifyContent: 'space-between',
              borderBottom: '1px solid #1976d2',
            }}
          >
            <Tooltip title='Nuotrauka' placement='top'>
              <Typography variant='h6' component='div' gutterBottom sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                <ImageOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
              </Typography>
            </Tooltip>
            <Tooltip title='Pavadinimas' placement='top'>
              <Typography variant='h6' component='div' gutterBottom sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                <StorefrontOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
              </Typography>
            </Tooltip>
            <Tooltip title='Galimas likutis' placement='top'>
              <Typography variant='h6' component='div' gutterBottom sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                <ShoppingBasketOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
              </Typography>
            </Tooltip>
            <Tooltip title='Imamas kiekis' placement='top'>
              <Typography variant='h6' component='div' gutterBottom sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                <ShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
              </Typography>
            </Tooltip>
            <Tooltip title='Rezervuojama nuo-iki' placement='top'>
              <Typography variant='h6' component='div' gutterBottom sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                <CalendarMonthOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
              </Typography>
            </Tooltip>
          </Box>
          {inventory?.length > 0 &&
            dataToRender.map((item) => (
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
                    ml: { xs: '18px', md: '0px' },
                    mb: { xs: '8px', md: '0px' },
                  }}
                >
                  <Box
                    component='img'
                    sx={{
                      height: 200,
                      width: 200,
                      maxHeight: { xs: 120, md: 150, xxl: 200 },
                      maxWidth: { xs: 120, md: 150, xxl: 200 },
                      borderRadius: 5,
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                    alt='redbull'
                    src={`https://backend.rbinv.lt/public/${item.image}`}
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
                      fontSize: { xs: 16, md: 18 },
                      marginBottom: 0,
                    }}
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
                      fontSize: { xs: 16, md: 18 },
                      marginBottom: 0,
                    }}
                  >
                    {countReservedItems(item)}
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
                    }}
                  >
                    <Button onClick={() => handleDecrement(item)} disabled={handleDecrementDisable(item)}>
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
                    <Button onClick={() => handleIncrement(item)} disabled={handleIncrementDisable(item)}>
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
                    sx={{
                      mr: 1,
                      color: '#1976d2',
                      display: { xs: 'flex', md: 'none' },
                    }}
                  />
                  <Box sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                    {redbullProductsIds.includes(item.id) ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='h6'>Paskirtis</Typography>
                        <TextField
                          placeholder='Pvz.: Lietuvos Bėgimo Taurė'
                          margin='normal'
                          fullWidth
                          name='purposeComment'
                          label='Paskirtis'
                          type='text'
                          id='purposeComment'
                          autoComplete='purposeComment'
                          onChange={(e) => handleCommentChange(item, e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        <Select
                          labelId='purpose'
                          id='purpose'
                          value={getValue(item) || ''}
                          onChange={(e) => handleSelectChange(e, item)}
                          fullWidth
                          sx={{
                            marginTop: '10px',
                            textAlign: 'center',
                          }}
                        >
                          {message.map((item) => (
                            <MenuItem key={item.value} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    ) : (
                      <Calendar
                        onChange={(date) => handleDateChange(date, item)}
                        value={getReservedDate(item)}
                        selectRange={true}
                        minDate={new Date()}
                        maxDate={new Date(new Date().setMonth(new Date().getMonth() + 6))}
                        locale='lt'
                        format='yyyy-MM-dd'
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
        </Box>
        {searchTerm === '' && (
          <Pagination
            count={count}
            size='large'
            page={page}
            variant='outlined'
            shape='rounded'
            onChange={handlePageChange}
            sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}
          />
        )}
      </Container>
    </>
  );
};

export default TakeInventory;
