import React from 'react';

import { Container, Box, Typography, Grid } from '@mui/material';

const Main = () => {
    return (
        <Container maxWidth="lg" sx={{ m: { xs: 1, md: 2 } }}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Šis puslapis yra skirtas sekti esamą sandėlio inventorių, jo likučius ir būklę. Norint
                            pasiimti inventorių, eikite į skiltį "Paimti inventorių" ir ten susižymėkite kokį kiekį
                            kurios rūšies inventoriaus imsite. Grąžinimo atveju, eikite į skiltį "Grąžinti inventorių"
                            ir ten pažymėkite gražinamo inventoriaus kiekius. Jei turite komentarų, palikite juos
                            komentaro skiltyje. Tai leis mums sekti sandėlio inventorių ir užtikrinti esamus ir
                            reikalingus likučius bei inventoriaus būklę. Kilus klausimams, susisiekite su mumis.
                        </Typography>
                        <Typography variant="h6" component="div" gutterBottom sx={{ mt: 2 }}>
                            Ačiū už dėmesį!
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Main;
