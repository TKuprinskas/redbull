import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import {
  Container,
  Box,
  Typography,
  Pagination,
  Button,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { myHistory, status } from '../state/selectors';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import usePagination from '../components/Pagination';
import moment from 'moment';
import { fetchMyHistory } from '../state/thunks';
import { getTokenFromStorage, getUserIdFromToken } from '../services/helpers';

const MyInventory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector(myHistory);
  const invStatus = useSelector(status);
  const [page, setPage] = useState(1);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [active, setActive] = useState('all');
  const isMobile = window.innerWidth < 600;
  const PER_PAGE = isMobile ? 10 : 20;
  const count = Math.ceil(filteredInventory.length / PER_PAGE);
  const _DATA = usePagination(filteredInventory, PER_PAGE);
  const [loaded, setLoaded] = useState(false);
  const token = getTokenFromStorage();
  const userId = getUserIdFromToken();
  const userToken = { userId, token };

  const filterTakenItems = (inv) => {
    const filteredInventory = inv.filter(
      (item) => item.isTaken === 1 || item.isReserved === 1
    );
    setActive('taken');
    setFilteredInventory(filteredInventory);
  };

  const filterReturnedItems = (inv) => {
    const filteredInventory = inv.filter(
      (item) => item.isTaken === 0 && item.isReserved === 0
    );
    setActive('returned');
    setFilteredInventory(filteredInventory);
  };

  const filterAllItems = (inv) => {
    const filteredInventory = inv.filter((item) => item);
    setActive('all');
    setFilteredInventory(filteredInventory);
  };

  const handlePageChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleComment = (comment) => {
    if (!comment) return 'Nėra komentaro';
    return comment;
  };

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

  useEffect(() => {
    dispatch(fetchMyHistory(userToken));
  }, [dispatch]);

  useEffect(() => {
    if (invStatus === 'succeeded') {
      setFilteredInventory(inventory);
      setLoaded(true);
    }
  }, [invStatus]);

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
        <Button
          variant='contained'
          onClick={() => filterAllItems(inventory)}
          sx={{
            mr: 1,
            mb: 1,
            backgroundColor: active === 'all' ? '#1976d2' : '#fff',
            color: active === 'all' ? '#fff' : '#1976d2',
            width: { xs: '20%', md: 'auto' },
          }}>
          Visi
        </Button>
        <Button
          variant='contained'
          onClick={() => filterReturnedItems(inventory)}
          sx={{
            mr: 1,
            mb: 1,
            backgroundColor: active === 'returned' ? '#1976d2' : '#fff',
            color: active === 'returned' ? '#fff' : '#1976d2',
            width: { xs: '30%', md: 'auto' },
          }}>
          Grąžinta
        </Button>
        <Button
          variant='contained'
          onClick={() => filterTakenItems(inventory)}
          sx={{
            mr: 1,
            mb: 1,
            backgroundColor: active === 'taken' ? '#1976d2' : '#fff',
            color: active === 'taken' ? '#fff' : '#1976d2',
            width: { xs: '40%', md: 'auto' },
          }}>
          Negrąžinta
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
          <Tooltip title='Produktas' placement='top'>
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
              <AddShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Negrąžintas kiekis' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <RemoveShoppingCartOutlinedIcon
                sx={{ mr: 1, color: '#1976d2' }}
              />
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
          <Tooltip title='Grąžinimo data' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{ flex: 1, width: 0, textAlign: 'center' }}>
              <EventRepeatOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
        </Box>
        <Box>
          {inventory?.length > 0 &&
            _DATA
              .currentData()
              .sort((a, b) => (a.takenDateTime > b.takenDateTime ? -1 : 1))
              .map((item, index) => (
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
                        padding: { xs: 0, md: 2 },
                        marginBottom: 0,
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
                        padding: { xs: 0, md: 2 },
                        marginBottom: 0,
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
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AddShoppingCartOutlinedIcon
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
                    }}>
                    <RemoveShoppingCartOutlinedIcon
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
                        fontSize: { xs: 14, md: 16 },
                        marginBottom: 0,
                      }}>
                      {handleComment(item.comment)}
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
                    <EventRepeatOutlinedIcon
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
                      {dateTimeHandler(item.returnedDateTime)}
                    </Typography>
                  </Box>
                </Box>
              ))}
        </Box>
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

export default MyInventory;
