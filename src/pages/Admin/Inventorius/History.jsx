import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import {
  Container,
  Box,
  Typography,
  Pagination,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  Select,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { allHistory, allUsers } from '../../../state/selectors';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import usePagination from '../../../components/Pagination';
import moment from 'moment';
import ExcelExport from '../../../components/ExcelExport';
import { fetchAllHistory, fetchAllUsers } from '../../../state/thunks';
import { getTokenFromStorage } from '../../../services/helpers';

const AdminHistory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector(allHistory);
  const users = useSelector(allUsers);
  const [page, setPage] = useState(1);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [active, setActive] = useState('all');
  const isMobile = window.innerWidth < 600;
  const PER_PAGE = isMobile ? 5 : 10;
  const count = Math.ceil(filteredInventory.length / PER_PAGE);
  const _DATA = usePagination(filteredInventory, PER_PAGE);
  const [loaded, setLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const defaultUser = 'Visi';

  const excelData = filteredInventory.map((item) => {
    return {
      'Inventoriaus pavadinimas': item.name,
      'Paimtas kiekis': item.quantityTaken,
      'Negrąžintas kiekis': item.quantityRemaining,
      'Paėmimo Data': moment(item.takenDateTime).format('YYYY-MM-DD HH:mm:ss'),
      'Rezervuota nuo': item.reservedFrom ? item.reservedFrom : '',
      'Rezervuota iki': item.reservedUntil ? item.reservedUntil : '',
      'Grąžinimo Data': item.returnedDateTime
        ? moment(item.returnedDateTime).format('YYYY-MM-DD HH:mm:ss')
        : 'Dar negrąžinta',
      'Komentaras grąžinant': item.comment,
      Vartotojas: item.username,
    };
  });

  const handleReservedFromUntil = (from, until) => {
    if (!from && !until) return 'Negrąžinta';
    const fromDate = moment(from).format('YYYY-MM-DD');
    const untilDate = moment(until).format('YYYY-MM-DD');
    return `${fromDate} - ${untilDate}`;
  };

  const filterTakenItems = (inventory) => {
    if (selectedUser) {
      const filteredInventory = inventory.filter(
        (item) =>
          item.userId === selectedUser.id &&
          (item.isTaken === 1 || item.isReserved === 1)
      );
      setActive('taken');
      setFilteredInventory(filteredInventory);
    } else {
      const filteredInventory = inventory.filter(
        (item) => item.isTaken === 1 || item.isReserved === 1
      );
      setActive('taken');
      setFilteredInventory(filteredInventory);
    }
  };

  const filterReturnedItems = (inventory) => {
    if (selectedUser) {
      const filteredInventory = inventory.filter(
        (item) =>
          item.userId === selectedUser.id &&
          item.isTaken === 0 &&
          item.isReserved === 0
      );
      setActive('returned');
      setFilteredInventory(filteredInventory);
    } else {
      const filteredInventory = inventory.filter(
        (item) => item.isTaken === 0 && item.isReserved === 0
      );
      setActive('returned');
      setFilteredInventory(filteredInventory);
    }
  };

  const filterAllItems = (inventory) => {
    if (selectedUser) {
      const filteredInventory = inventory.filter(
        (item) => item.userId === selectedUser.id
      );
      setActive('all');
      setFilteredInventory(filteredInventory);
    } else {
      const filteredInventory = inventory.filter((item) => item);
      setActive('all');
      setFilteredInventory(filteredInventory);
    }
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

  useEffect(() => {
    const token = getTokenFromStorage();
    if (inventory?.length > 0 && users?.length > 0) {
      setFilteredInventory(inventory);
      setLoaded(true);
    } else {
      dispatch(fetchAllHistory(token));
      dispatch(fetchAllUsers(token));
    }
  }, [dispatch, inventory, users]);

  const handleSelectChange = (event) => {
    const { value } = event.target;
    if (value === defaultUser) {
      setFilteredInventory(inventory);
      setSelectedUser(null);
    } else {
      const findUser = users.find((user) => user.id === value);
      setSelectedUser(findUser);
      const filteredInventory = inventory.filter(
        (item) => item.userId === value
      );
      setFilteredInventory(filteredInventory);
    }
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
        <Box sx={{ width: 1 }}>
          <ExcelExport excelData={excelData} fileName='Inventorius' />
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            width: '100%',
            borderBottom: '1px solid #1976d2',
          }}>
          <Tooltip title='Nuotrauka' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                width: 0,
              }}>
              <ImageOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Paėmimo data' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                width: 0,
              }}>
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
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                width: 0,
              }}>
              <StorefrontOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Paimtas kiekis' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                width: 0,
              }}>
              <AddShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Negrąžintas kiekis' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                width: 0,
              }}>
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
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                width: 0,
              }}>
              <ChatBubbleOutlineOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Tooltip title='Grąžinimo data' placement='top'>
            <Typography
              variant='h6'
              component='div'
              gutterBottom
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                width: 0,
              }}>
              <EventRepeatOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
            </Typography>
          </Tooltip>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              width: 0,
              textAlign: 'center',
            }}>
            <Tooltip title='Filtruoti pagal vartotoją' placement='top'>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id='demo-simple-select-label'>
                  <PersonOutlineOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={selectedUser ? selectedUser.id : defaultUser}
                  onChange={handleSelectChange}
                  sx={{
                    width: { xs: '100%', md: 'auto', textAlign: 'center' },
                  }}>
                  <MenuItem value={defaultUser}>Visi</MenuItem>
                  {users.map((user, index) => (
                    <MenuItem key={index} value={user.id}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
          </Box>
        </Box>
        <Box>
          {inventory?.length > 0 &&
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
                {' '}
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
                      maxHeight: { xs: 150, md: 170 },
                      maxWidth: { xs: 220, md: 250 },
                      borderRadius: 5,
                      mb: 1,
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
                    sx={{ flex: 1, width: 0, textAlign: 'center' }}>
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
                    sx={{ flex: 1, width: 0, textAlign: 'center' }}>
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
                    sx={{ flex: 1, width: 0, textAlign: 'center' }}>
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
                    sx={{ flex: 1, width: 0, textAlign: 'center' }}>
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
                    sx={{ flex: 1, width: 0, textAlign: 'center' }}>
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
                    sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                    {dateTimeHandler(item.returnedDateTime)}
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
                  <PersonOutlineOutlinedIcon
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
                    sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                    {item.username}
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

export default AdminHistory;
