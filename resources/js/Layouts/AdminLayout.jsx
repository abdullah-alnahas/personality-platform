// Edit file: resources/js/Layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Link as InertiaLink, router, usePage } from "@inertiajs/react";
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
    Snackbar,
    Alert,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import LinkIcon from "@mui/icons-material/Link";
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People"; // Assuming this might be used later for Users
import LockPersonIcon from "@mui/icons-material/LockPerson"; // Assuming this might be used later for Roles
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"; // Icon for Quotes

const drawerWidth = 240;

export default function AdminLayout({ children, title = "Admin Panel" }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Not actively used, can be removed if not needed
    const { flash, auth } = usePage().props;
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        if (flash?.success) {
            setSnackbarMessage(flash.success);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } else if (flash?.error) {
            setSnackbarMessage(flash.error);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    }, [flash]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("admin.logout"));
    };

    const drawerContent = (
        <div>
            <Toolbar /> {/* Spacer for AppBar */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        component={InertiaLink}
                        href={route("admin.dashboard")}
                        selected={route().current("admin.dashboard")}
                    >
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />
                <Typography
                    variant="caption"
                    sx={{ pl: 2, color: "text.secondary" }}
                >
                    Content
                </Typography>

                <ListItem disablePadding>
                    <ListItemButton
                        component={InertiaLink}
                        href={route("admin.content-categories.index")}
                        selected={route().current("admin.content-categories.*")}
                    >
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Categories" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        component={InertiaLink}
                        href={route("admin.content-items.index")}
                        selected={route().current("admin.content-items.*")}
                    >
                        <ListItemIcon>
                            <ArticleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Content Items" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        component={InertiaLink}
                        href={route("admin.quotes.index")}
                        selected={route().current("admin.quotes.*")}
                    >
                        <ListItemIcon>
                            <FormatQuoteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Quotes" />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />
                <Typography
                    variant="caption"
                    sx={{ pl: 2, color: "text.secondary" }}
                >
                    Site Structure
                </Typography>

                <ListItem disablePadding>
                    <ListItemButton
                        component={InertiaLink}
                        href={route("admin.navigation-items.index")}
                        selected={route().current("admin.navigation-items.*")}
                    >
                        <ListItemIcon>
                            <LinkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Navigation" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        component={InertiaLink}
                        href={route("admin.social-accounts.index")}
                        selected={route().current("admin.social-accounts.*")}
                    >
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary="Social Accounts" />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />
                <Typography
                    variant="caption"
                    sx={{ pl: 2, color: "text.secondary" }}
                >
                    Administration
                </Typography>

                <ListItem disablePadding>
                    <ListItemButton
                        component={InertiaLink}
                        href={route("admin.settings.edit")}
                        selected={route().current("admin.settings.edit")}
                    >
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </ListItem>
                {/* Example for future Users/Roles links - ensure routes and permissions exist before uncommenting */}
                {/*
                {auth.user.can_manage_users && ( // Example permission check
                    <ListItem disablePadding>
                        <ListItemButton component={InertiaLink} href={route('admin.users.index')} selected={route().current('admin.users.*')}>
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItemButton>
                    </ListItem>
                )}
                {auth.user.can_manage_roles && ( // Example permission check
                    <ListItem disablePadding>
                        <ListItemButton component={InertiaLink} href={route('admin.roles.index')} selected={route().current('admin.roles.*')}>
                            <ListItemIcon><LockPersonIcon /></ListItemIcon>
                            <ListItemText primary="Roles" />
                        </ListItemButton>
                    </ListItem>
                )}
                */}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        {title} {/* Page title passed as prop */}
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {auth.user.name}
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="logout"
                        edge="end"
                        onClick={handleLogout}
                    >
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawerContent}
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
                <Toolbar />{" "}
                {/* This Toolbar acts as a spacer for the fixed AppBar */}
                {children}
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    key={snackbarMessage}
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
