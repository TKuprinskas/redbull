import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  Container,
  Box,
  Typography,
  Button,
  Pagination,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  inventoryItems,
  inventoryBalanceForToday,
} from '../../../state/selectors';
import AddInventory from './AddInventory';
import { getTokenFromStorage } from '../../../services/helpers';
import { deleteInventoryAsync } from '../../../services/API';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EditInventory from './EditInventory';
import usePagination from '../../../components/Pagination';
import {
  fetchInventory,
  fetchInventoryBalanceForToday,
} from '../../../state/thunks';
import { deleteInventoryItem } from '../../../state/slice';

const AdminInventory = () => {
  const dispatch = useDispatch();
  const inventory = useSelector(inventoryItems);
  const inventoryBalance = useSelector(inventoryBalanceForToday);
  const [view, setView] = useState('inventoryList');
  const [selectedItem, setSelectedItem] = useState();
  const [page, setPage] = useState(1);
  const isMobile = window.innerWidth < 600;
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
    if (inventory?.length > 0) {
      setLoaded(true);
    } else {
      dispatch(fetchInventory(token));
      dispatch(fetchInventoryBalanceForToday(token));
      setLoaded(true);
    }
  }, [dispatch, inventory]);

  const updatedRemainingBalanceForToday = (item) => {
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

  const updatedTakenBalanceForToday = (item) => {
    const checkAvailability = inventoryBalance?.filter((x) => x.id === item.id);
    if (checkAvailability) {
      let count = 0;
      checkAvailability.forEach((x) => {
        count += x.quantityTaken;
      });
      const updatedBalance = item.quantityTaken + count;
      return updatedBalance;
    }
    return item.quantityTaken;
  };

  const handleEditInventory = (item) => {
    setView('editInventory');
    setSelectedItem(item);
  };

  const handleDeleteInventory = async (id) => {
    const token = getTokenFromStorage();
    await deleteInventoryAsync(token, id);
    dispatch(deleteInventoryItem(id));
    setTimeout(() => {
      dispatch(fetchInventory(token));
      setView('inventoryList');
    }, 1500);
  };

  const changeView = () => {
    setView('addInventory');
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: '',
      message: 'Ar tikrai norite ištrinti vartotoją?',
      buttons: [
        {
          label: 'Taip',
          onClick: () => handleDeleteInventory(id),
        },
        {
          label: 'Ne',
        },
      ],
    });
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
      {view === 'inventoryList' && (
        <>
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Button
              variant='contained'
              sx={{ mb: 2 }}
              onClick={() => changeView()}>
              <AddShoppingCartOutlinedIcon /> &nbsp; Pridėti inventorių
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
              <Tooltip title='Pavadinimas' placement='top'>
                <Typography
                  variant='h6'
                  component='div'
                  gutterBottom
                  sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                  <StorefrontOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                </Typography>
              </Tooltip>
              <Tooltip title='Pradinis likutis' placement='top'>
                <Typography
                  variant='h6'
                  component='div'
                  gutterBottom
                  sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                  <ShoppingCartCheckoutOutlinedIcon
                    sx={{ mr: 1, color: '#1976d2' }}
                  />
                </Typography>
              </Tooltip>
              <Tooltip title='Esamas likutis' placement='top'>
                <Typography
                  variant='h6'
                  component='div'
                  gutterBottom
                  sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                  <ShoppingCartOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
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
                  <ChatBubbleOutlineOutlinedIcon
                    sx={{ mr: 1, color: '#1976d2' }}
                  />
                </Typography>
              </Tooltip>
              <Tooltip title='Redaguoti' placement='top'>
                <Typography
                  variant='h6'
                  component='div'
                  gutterBottom
                  sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                  <EditOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                </Typography>
              </Tooltip>
              <Tooltip title='Ištrinti' placement='top'>
                <Typography
                  variant='h6'
                  component='div'
                  gutterBottom
                  sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                  <DeleteForeverOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                </Typography>
              </Tooltip>
            </Box>
            {inventory?.length > 0 &&
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
                    <ShoppingCartOutlinedIcon
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
                      {item.quantityAdded}
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
                        fontSize: { xs: 16, md: 18 },
                        marginBottom: 0,
                      }}>
                      {updatedRemainingBalanceForToday(item)}
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
                        fontSize: { xs: 16, md: 18 },
                        marginBottom: 0,
                      }}>
                      {updatedTakenBalanceForToday(item)}
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
                  <Box
                    sx={{
                      display: 'flex',
                      flex: { xs: 0, md: 1 },
                      width: { xs: 1, md: 0 },
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <EditOutlinedIcon
                      sx={{
                        mr: 1,
                        color: '#1976d2',
                        display: { xs: 'flex', md: 'none' },
                      }}
                    />
                    <Box sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                      <Button
                        variant='contained'
                        sx={{ mb: 2 }}
                        onClick={() => handleEditInventory(item)}>
                        Redaguoti
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
                    }}>
                    <DeleteForeverOutlinedIcon
                      sx={{
                        mr: 1,
                        color: '#1976d2',
                        display: { xs: 'flex', md: 'none' },
                      }}
                    />
                    <Box sx={{ flex: 1, width: 0, textAlign: 'center' }}>
                      <Button
                        variant='contained'
                        sx={{ mb: 2 }}
                        onClick={() => confirmDelete(item.id)}>
                        Ištrinti
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </>
      )}
      {view === 'addInventory' && <AddInventory setView={setView} />}
      {view === 'editInventory' && (
        <EditInventory setView={setView} selectedItem={selectedItem} />
      )}
      {view !== 'addInventory' && view !== 'editInventory' && (
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
  );
};

export default AdminInventory;
