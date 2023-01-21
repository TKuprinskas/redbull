import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import RememberMeOutlinedIcon from '@mui/icons-material/RememberMeOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';

const UsersList = () => {
    return (
        <Container maxWidth="lg" sx={{ m: { xs: 1, md: 2 } }}>
            <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Box
                    sx={{
                        mt: 2,
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #1976d2',
                    }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ flex: 1, width: 0, textAlign: 'center' }}
                    >
                        <PersonOutlineOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ flex: 1, width: 0, textAlign: 'center' }}
                    >
                        <KeyOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ flex: 1, width: 0, textAlign: 'center' }}
                    >
                        <RememberMeOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ flex: 1, width: 0, textAlign: 'center' }}
                    >
                        <LockResetOutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                    </Typography>
                    <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ flex: 1, width: 0, textAlign: 'center' }}
                    >
                        <PersonRemoveAlt1OutlinedIcon sx={{ mr: 1, color: '#1976d2' }} />
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default UsersList;
