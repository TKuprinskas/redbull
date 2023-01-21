import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenFromStorage } from './helpers';
import { Container, Box, Button } from '@mui/material';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const [hasLoaded, setHasLoaded] = useState(false);
    const token = getTokenFromStorage();

    useEffect(() => {
        setHasLoaded(true);
    }, []);

    const onClickHandler = () => {
        navigate('/login');
    };

    if (token === null) {
        return (
            <Container>
                <Box>
                    <h1>Norėdami pasiekti šį puslapį, jūs turite būti prisijungęs (-us) prie sistemos.</h1>
                    <Box>
                        <Button color="primary" onClick={onClickHandler}>
                            Prisijungti
                        </Button>
                    </Box>
                </Box>
            </Container>
        );
    } else if (hasLoaded) {
        return <>{children}</>;
    } else {
        return <div>Loading...</div>;
    }
};

export default PrivateRoute;
