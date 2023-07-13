import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container, Box, Typography, Pagination, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { inventoryItems, inventoryBalanceForToday } from '../state/selectors';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import usePagination from '../components/Pagination';
import { fetchInventory, fetchInventoryBalanceForToday } from '../state/thunks';
import { getTokenFromStorage } from '../services/helpers';

const UserInventory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector(inventoryItems);
  const inventoryBalance = useSelector(inventoryBalanceForToday);
  const isMobile = window.innerWidth < 600;
  const [page, setPage] = useState(1);
  const PER_PAGE = isMobile ? 10 : 20;
  const count = Math.ceil(inventory?.length / PER_PAGE);
  const _DATA = usePagination(inventory, PER_PAGE);
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => {
    const token = getTokenFromStorage();
    dispatch(fetchInventory(token));
    dispatch(fetchInventoryBalanceForToday(token));
    setTimeout(() => {
      if (inventory) setLoaded(true);
    }, 200);
  }, [dispatch, inventory]);

  const updatedBalanceForToday = (item) => {
    const checkAvailability = inventoryBalance?.filter((x) => x.id === item.id);
    if (checkAvailability) {
      let count = 0;
      checkAvailability.forEach((x) => {
        count += x.quantityTaken;
      });
      const updatedBalance = item.quantityRemaining - count;
      return updatedBalance;
    }
    return item.quantityRemaining;
  };

  const handlePageChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!loaded) {
    return <h1>Kraunami duomenys..</h1>;
  }

  return (
    <Container maxWidth='lg' sx={{ m: { xs: 1, md: 2 } }} ref={topRef}>
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
          <Tooltip title='Produktas' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <StorefrontOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Esamas likutis' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <ShoppingBasketOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
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
        {inventory.length > 0 &&
          _DATA.currentData().map((item, index) => (
            <Box
              key={index}
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
                  }}>
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
                    fontSize: { xs: 16, md: 18 },
                    marginBottom: 0,
                  }}>
                  {updatedBalanceForToday(item)}
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
                <ChatBubbleOutlineOutlinedIcon
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
                  }}>
                  {item.comment}
                </Typography>
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

export default UserInventory;
