import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import redbull from '../../src/assets/images/redbull.jpg';
import { loginAsync } from '../services/API';

function Copyright(props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} component='footer'>
      <Typography variant='body2' color='text.secondary' align='center' {...props}>
        {'Copyright © MV Group Distribution LT '}
        {new Date().getFullYear()}
      </Typography>
      <Typography variant='body2' color='text.secondary' align='center'>
        {'All rights reserved' + ' | '}{' '}
        <Link color='inherit' href='https://tkuprinskas.lt/' target='_blank' rel='noopener'>
          tkuprinskas.lt
        </Link>
      </Typography>
    </Box>
  );
}

const theme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await loginAsync(data.get('username'), data.get('password')).then((response) => {
      if (response.status === 'SUCCESS') {
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1500);
      } else {
        return;
      }
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
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
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component='img'
            sx={{
              height: 200,
              width: 200,
              maxHeight: { xs: 120, md: 150, xxl: 200 },
              maxWidth: { xs: 120, md: 150, xxl: 200 },
              mb: 2,
              borderRadius: 5,
            }}
            alt='redbull'
            src={redbull}
          />
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Prisijungimas
          </Typography>
          <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin='normal' required fullWidth id='username' label='Username' name='username' autoComplete='username' autoFocus />
            <TextField margin='normal' required fullWidth name='password' label='Password' type='password' id='password' autoComplete='current-password' />
            <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Prisiminti mane' />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Prisijungti
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
