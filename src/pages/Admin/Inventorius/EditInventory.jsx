import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { editInventoryAsync } from '../../../services/API';
import { getTokenFromStorage } from '../../../services/helpers';
import { fetchInventory } from '../../../state/thunks';
import { useEffect } from 'react';

const theme = createTheme();

const EditInventory = ({ setView, selectedItem }) => {
  const dispatch = useDispatch();
  const [item, setItem] = useState(selectedItem);
  const [quantityRemaining, setQuantityRemaining] = useState(
    selectedItem.quantityRemaining
  );
  const [quantityDifference, setQuantityDifference] = useState(0);

  useEffect(() => {
    const difference = item.quantityAdded - selectedItem.quantityAdded;
    setQuantityDifference(difference);
    setQuantityRemaining(selectedItem.quantityRemaining + difference);
  }, [item, selectedItem]);

  const handleQuantityChange = (item, e) => {
    setItem({ ...item, quantityAdded: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const token = getTokenFromStorage();
    await editInventoryAsync(
      item.id,
      quantityDifference,
      data.get('productId'),
      data.get('name'),
      data.get('quantityAdded'),
      data.get('comment'),
      token
    );
    setTimeout(() => {
      dispatch(fetchInventory(token));
      setView('inventoryList');
    }, 1500);
  };

  const changeView = () => {
    setView('inventoryList');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='xs' sx={{ m: { xs: 1, md: 2 } }}>
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
            sx={{ mb: 2 }}
            onClick={() => changeView()}>
            Grįžti atgal
          </Button>
        </Box>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Typography component='h1' variant='h5'>
            Redaguoti inventorių
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='productId'
              label='Produkto ID'
              name='productId'
              autoComplete='productId'
              autoFocus
              value={item.product_id}
              onChange={(e) => setItem({ ...item, product_id: e.target.value })}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              id='name'
              label='Pavadinimas'
              name='name'
              autoComplete='name'
              autoFocus
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='quantityAdded'
              label='Pradinis kiekis'
              type='number'
              id='quantityAdded'
              autoComplete='quantityAdded'
              value={item.quantityAdded}
              onChange={(e) => handleQuantityChange(item, e)}
            />
            <TextField
              margin='normal'
              fullWidth
              name='quantityRemaining'
              label='Esamas kiekis'
              type='number'
              id='quantityRemaining'
              autoComplete='quantityRemaining'
              value={quantityRemaining}
              disabled
            />
            <TextField
              margin='normal'
              fullWidth
              name='comment'
              label='Komentaras'
              type='text'
              id='comment'
              autoComplete='comment'
              value={item.comment}
              onChange={(e) => setItem({ ...item, comment: e.target.value })}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Išsaugoti
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EditInventory;
