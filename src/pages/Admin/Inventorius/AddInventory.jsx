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
import {
  addInventoryAsync,
  addInventoryItemImageAsync,
} from '../../../services/API';
import { getTokenFromStorage } from '../../../services/helpers';
import { fetchInventory } from '../../../state/thunks';

const theme = createTheme();

const AddInventory = ({ setView }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = getTokenFromStorage();
    const image = event.target.elements.image.files[0];
    formData.append('image', image);
    await addInventoryAsync(
      formData.get('name'),
      formData.get('productId'),
      formData.get('quantityAdded'),
      formData.get('comment'),
      token
    )
      .then(async (res) => {
        const productItemId = res.data;
        const image = formData.get('image');
        if (image) {
          await addInventoryItemImageAsync(token, formData, productItemId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
            Pridėti inventorių
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
              id='name'
              label='Pavadinimas'
              name='name'
              autoComplete='name'
              autoFocus
            />
            <TextField
              margin='normal'
              fullWidth
              id='productId'
              label='Produkto ID'
              name='productId'
              autoComplete='productId'
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='quantityAdded'
              label='Kiekis'
              type='number'
              id='quantityAdded'
              autoComplete='quantityAdded'
            />
            <TextField
              margin='normal'
              fullWidth
              name='comment'
              label='Komentaras'
              type='text'
              id='comment'
              autoComplete='comment'
            />
            <input
              type='file'
              name='image'
              accept='image/*'
              id='image'
              style={{ display: 'none' }}
              onChange={(e) => {
                const fileName = e.target.value.split('\\').pop();
                const label = document.querySelector('#imageLabel');
                label.innerHTML = fileName;
              }}
            />
            <label htmlFor='image'>
              <Button
                component='span'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}>
                Pasirinkti paveikslėlį
              </Button>
              <Typography variant='body1' id='imageLabel' sx={{ mt: 1 }}>
                Nepasirinktas paveikslėlis
              </Typography>
            </label>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Pridėti
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AddInventory;
