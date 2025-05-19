import React, { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link as InertiaLink, usePage } from "@inertiajs/react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Container,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    ThemeProvider,
    createTheme,
    CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard"; // Example icon
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";

// A minimal theme for authenticated user pages, can be expanded or use the main theme
// For now, using a simple theme, assuming main theme is in Public/Admin layouts
const authTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "#f4f6f8", // A light grey background
        },
        primary: {
            main: "#008080", // Align with app.jsx
        },
        secondary: {
            main: "#f5f5dc", // Align with app.jsx
        },
    },
    typography: {
        fontFamily:
            '"Cairo", "Tajawal", "Noto Sans Arabic", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
});

export default function AuthenticatedLayout({ user, header, children }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { muiTheme: pageTheme } = usePage().props;
    const activeTheme = pageTheme || authTheme;

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const navLinks = [
        {
            href: route("dashboard"),
            label: "Dashboard",
            icon: <DashboardIcon />,
        },
        // Add other authenticated non-admin links here if needed
    ];

    const userMenuItems = [
        { href: route("profile.edit"), label: "Profile", icon: <PersonIcon /> },
        {
            action: () => router.post(route("logout")),
            label: "Log Out",
            icon: <ExitToAppIcon />,
            isLogout: true,
        },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Menu
            </Typography>
            <Divider />
            <List>
                {navLinks.map((link) => (
                    <ListItem key={link.label} disablePadding>
                        <ListItemButton
                            component={InertiaLink}
                            href={link.href}
                        >
                            <ListItemIcon>{link.icon}</ListItemIcon>
                            <ListItemText primary={link.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                {userMenuItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton
                            component={item.href ? InertiaLink : "div"}
                            href={item.href ? item.href : undefined}
                            onClick={item.action ? item.action : undefined}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={activeTheme}>
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <AppBar position="static" color="default" elevation={1}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: "none" } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <InertiaLink href="/">
                                <ApplicationLogo
                                    sx={{
                                        display: { xs: "none", sm: "flex" },
                                        mr: 1,
                                        height: 32,
                                    }}
                                />
                            </InertiaLink>

                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    flexGrow: 1,
                                    display: { xs: "flex", sm: "none" },
                                }}
                            >
                                <InertiaLink href="/">
                                    <ApplicationLogo sx={{ height: 32 }} />
                                </InertiaLink>
                            </Typography>

                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: { xs: "none", sm: "flex" },
                                    gap: 2,
                                    ml: 2,
                                }}
                            >
                                {navLinks.map((link) => (
                                    <Button
                                        key={link.label}
                                        component={InertiaLink}
                                        href={link.href}
                                        color={
                                            route().current(
                                                link.href.substring(
                                                    link.href.lastIndexOf("/") +
                                                        1,
                                                ),
                                            )
                                                ? "primary"
                                                : "inherit"
                                        }
                                        variant={
                                            route().current(
                                                link.href.substring(
                                                    link.href.lastIndexOf("/") +
                                                        1,
                                                ),
                                            )
                                                ? "outlined"
                                                : "text"
                                        }
                                    >
                                        {link.label}
                                    </Button>
                                ))}
                            </Box>

                            <Box sx={{ flexGrow: 0 }}>
                                <Button
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                    endIcon={<AccountCircle />}
                                >
                                    {user.name}
                                </Button>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    {userMenuItems.map((item) => (
                                        <MenuItem
                                            key={item.label}
                                            onClick={
                                                item.action
                                                    ? () => {
                                                          item.action();
                                                          handleClose();
                                                      }
                                                    : handleClose
                                            }
                                            component={
                                                item.href ? InertiaLink : "div"
                                            }
                                            href={
                                                item.href
                                                    ? item.href
                                                    : undefined
                                            }
                                            sx={{ gap: 1 }}
                                        >
                                            {item.icon} {item.label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

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
                            width: 240,
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {header && (
                    <Box
                        component="header"
                        sx={{ bgcolor: "background.paper", boxShadow: 1 }}
                    >
                        <Container
                            maxWidth="xl"
                            sx={{ py: 2, px: { xs: 2, sm: 3 } }}
                        >
                            {/* The header prop is expected to be a ReactNode, often Typography */}
                            {header}
                        </Container>
                    </Box>
                )}

                <Box
                    component="main"
                    sx={{ flexGrow: 1, py: { xs: 2, sm: 3 } }}
                >
                    <Container maxWidth="xl">{children}</Container>
                </Box>

                {/* Optional: Footer for Authenticated Layout */}
                {/*
                <Box component="footer" sx={{ bgcolor: 'background.paper', p: 2, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
                    <Container maxWidth="xl">
                        <Typography variant="body2" color="text.secondary" align="center">
                            © {new Date().getFullYear()} Your Company
                        </Typography>
                    </Container>
                </Box>
                */}
            </Box>
        </ThemeProvider>
    );
}
