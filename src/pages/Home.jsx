import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Pagrindinis from './Main';
import { AdminMenu, Menu } from '../constants/Menu';
import { Button } from '@mui/material';
import redbull from '../../src/assets/images/redbull.jpg';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined';
import Users from './Admin/Vartotojai/Users';
import { getUserRoleFromToken } from '../services/helpers';
import AdminInventory from './Admin/Inventorius/Inventory';
import UserInventory from './Inventory';
import TakeInventory from './TakeInventory';
import ReturnInventory from './ReturnInventory';
import MyInventory from './MyHistory';
import AdminHistory from './Admin/Inventorius/History';
import { persistor } from '../state/store';

const drawerWidth = 240;

const Home = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [pageTitle, setPageTitle] = useState('Pagrindinis');

    useEffect(() => {
        const getUserRole = async () => {
            const role = await getUserRoleFromToken();
            setUserRole(role);
        };
        getUserRole();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (item) => {
        setPageTitle(item.title);
        setMobileOpen(!mobileOpen);
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        persistor.purge();
        navigate('/', { replace: true });
    };

    const menuIcons = (id) => {
        switch (id) {
            case 1:
                return <HomeOutlinedIcon />;
            case 2:
                return <Inventory2OutlinedIcon />;
            case 3:
                return <AddShoppingCartOutlinedIcon />;
            case 4:
                return <RemoveShoppingCartOutlinedIcon />;
            case 5:
                return <HistoryOutlinedIcon />;
            case 6:
                return <ProductionQuantityLimitsOutlinedIcon />;
            case 7:
                return <ManageAccountsOutlinedIcon />;
            case 8:
                return <ManageHistoryOutlinedIcon />;
            default:
                return <HomeOutlinedIcon />;
        }
    };

    const isSelected = (item) => {
        return item.title === pageTitle;
    };

    const drawer = (
        <div>
            <Toolbar>
                <Box
                    component="img"
                    sx={{
                        height: '100%',
                        width: '100%',
                        maxHeight: { xs: 150, md: 170 },
                        maxWidth: { xs: 220, md: 250 },
                        borderRadius: 5,
                    }}
                    alt="redbull"
                    src={redbull}
                />
            </Toolbar>
            <Divider />
            {userRole === 'user' && (
                <>
                    <List sx={{ p: 0 }}>
                        {Menu.map((item, index) => (
                            <ListItem key={index} disablePadding selected={isSelected(item)}>
                                <ListItemButton onClick={() => handleMenuClick(item)}>
                                    <ListItemIcon>{menuIcons(item.id)}</ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </>
            )}
            {userRole === 'admin' && (
                <>
                    <List sx={{ p: 0 }}>
                        {AdminMenu.map((item, index) => (
                            <ListItem key={index} disablePadding selected={isSelected(item)}>
                                <ListItemButton onClick={() => handleMenuClick(item)}>
                                    <ListItemIcon>{menuIcons(item.id)}</ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </>
            )}
            <Box sx={{ p: 2 }}>
                <Button variant="contained" sx={{ width: '100%' }} onClick={() => handleSignOut()}>
                    <ExitToAppIcon /> &nbsp; Atsijungti
                </Button>
            </Box>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {pageTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {pageTitle === 'Pagrindinis' && <Pagrindinis />}
                {pageTitle === 'Tvarkyti vartotojus' && <Users />}
                {pageTitle === 'Tvarkyti inventorių' && <AdminInventory />}
                {pageTitle === 'Žiūrėti istoriją' && <AdminHistory />}
                {pageTitle === 'Inventorius' && <UserInventory />}
                {pageTitle === 'Paimti inventorių' && <TakeInventory />}
                {pageTitle === 'Grąžinti inventorių' && <ReturnInventory />}
                {pageTitle === 'Mano istorija' && <MyInventory />}
            </Box>
        </Box>
    );
};

export default Home;
