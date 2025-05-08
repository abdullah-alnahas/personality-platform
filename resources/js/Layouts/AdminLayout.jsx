// Edit file: resources/js/Layouts/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link as InertiaLink, router, usePage } from '@inertiajs/react';
import {
    AppBar, Box, CssBaseline, Drawer, IconButton, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography,
    useTheme, useMediaQuery, Snackbar, Alert, Divider // Import Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LinkIcon from '@mui/icons-material/Link'; // Icon for Navigation
import GroupIcon from '@mui/icons-material/Group'; // Icon for Social Accounts (example)
import PeopleIcon from '@mui/icons-material/People'; // Icon for Users
import LockPersonIcon from '@mui/icons-material/LockPerson'; // Icon for Roles

const drawerWidth = 240;

export default function AdminLayout({ children, title = "Admin Panel" }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { flash, auth } = usePage().props; // Include auth to check permissions later if needed
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // --- Effect & Handlers remain the same ---
    useEffect(() => {
        if (flash?.success) {
            setSnackbarMessage(flash.success);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } else if (flash?.error) {
            setSnackbarMessage(flash.error);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, [flash]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('admin.logout'));
    }

    // --- Drawer Content ---
    const drawerContent = (
        <div>
            <Toolbar /> {/* Spacer for AppBar */}
            <List>
                {/* Dashboard Link */}
                <ListItem disablePadding>
                    <ListItemButton component={InertiaLink} href={route('admin.dashboard')} selected={route().current('admin.dashboard')}>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" sx={{ pl: 2, color: 'text.secondary' }}>Content</Typography>

                {/* Content Categories Link */}
                <ListItem disablePadding>
                    <ListItemButton component={InertiaLink} href={route('admin.content-categories.index')} selected={route().current('admin.content-categories.*')}>
                        <ListItemIcon><CategoryIcon /></ListItemIcon>
                        <ListItemText primary="Categories" />
                    </ListItemButton>
                </ListItem>

                {/* Content Items Link */}
                <ListItem disablePadding>
                    <ListItemButton component={InertiaLink} href={route('admin.content-items.index')} selected={route().current('admin.content-items.*')}>
                        <ListItemIcon><ArticleIcon /></ListItemIcon>
                        <ListItemText primary="Content Items" />
                    </ListItemButton>
                </ListItem>

                {/* Add Media Library Link later */}

                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" sx={{ pl: 2, color: 'text.secondary' }}>Site Structure</Typography>

                {/* Navigation Items Link - ADDED */}
                <ListItem disablePadding>
                    <ListItemButton component={InertiaLink} href={route('admin.navigation-items.index')} selected={route().current('admin.navigation-items.*')}>
                        <ListItemIcon><LinkIcon /></ListItemIcon>
                        <ListItemText primary="Navigation" />
                    </ListItemButton>
                </ListItem>

                {/* Social Accounts Link - ADDED */}
                <ListItem disablePadding>
                    <ListItemButton component={InertiaLink} href={route('admin.social-accounts.index')} selected={route().current('admin.social-accounts.*')}>
                        <ListItemIcon><GroupIcon /></ListItemIcon> {/* Example Icon */}
                        <ListItemText primary="Social Accounts" />
                    </ListItemButton>
                </ListItem>


                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" sx={{ pl: 2, color: 'text.secondary' }}>Administration</Typography>

                {/* Settings Link */}
                <ListItem disablePadding>
                    <ListItemButton component={InertiaLink} href={route('admin.settings.edit')} selected={route().current('admin.settings.edit')}>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>

                {/* Add Users/Roles Links later */}
                {/* <ListItem disablePadding>
                    <ListItemButton component={InertiaLink} href={route('admin.users.index')} selected={route().current('admin.users.*')}>
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItemButton>
                </ListItem>
                 <ListItem disablePadding>
                    <ListItemButton component={InertiaLink} href={route('admin.roles.index')} selected={route().current('admin.roles.*')}>
                        <ListItemIcon><LockPersonIcon /></ListItemIcon>
                        <ListItemText primary="Roles" />
                    </ListItemButton>
                </ListItem> */}


            </List>
        </div>
    );

    // --- Main Layout Structure (remains the same) ---
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}> <MenuIcon /> </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}> {title} </Typography>
                    <IconButton color="inherit" aria-label="logout" edge="end" onClick={handleLogout}> <LogoutIcon /> </IconButton>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
                {/* Mobile Drawer */}
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true, }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, }} > {drawerContent} </Drawer>
                {/* Desktop Drawer */}
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }, }} open > {drawerContent} </Drawer>
            </Box>

            {/* Main Content Area */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar /> {/* This Toolbar acts as a spacer */}
                {children}
            </Box>

            {/* --- Snackbar for Flash Messages --- */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert key={snackbarMessage} onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}