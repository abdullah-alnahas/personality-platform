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
    Snackbar,
    Alert,
    Divider,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import LinkIcon from "@mui/icons-material/Link";
import GroupIcon from "@mui/icons-material/Group";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import LanguageIcon from "@mui/icons-material/Language";

const drawerWidth = 240;

export default function AdminLayout({ children, title = "Admin Panel" }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const {
        flash,
        auth,
        ziggy,
        available_locales: availableLocales,
        current_locale: currentLocale,
    } = usePage().props;

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
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("admin.logout"));
    };

    const handleLanguageChange = (event) => {
        const newLocale = event.target.value;
        console.log(
            "Language Switcher (Admin): Attempting to change language.",
        );
        console.log("Current Locale from props:", currentLocale);
        console.log("New Locale selected:", newLocale);
        console.log(
            "Is newLocale different?",
            newLocale && newLocale !== currentLocale,
        );
        console.log("Current ziggy.location (URL path):", ziggy?.location);
        console.log("Current ziggy.query (params):", ziggy?.query);

        if (newLocale && newLocale !== currentLocale) {
            const baseUrl = ziggy.location.split("?")[0];
            const currentQuery = { ...ziggy.query };
            currentQuery.lang = newLocale;
            Object.keys(currentQuery).forEach((key) => {
                if (currentQuery[key] === undefined) delete currentQuery[key];
            });

            console.log("Navigating to URL (Admin):", baseUrl);
            console.log("With query params (Admin):", currentQuery);
            router.get(baseUrl, currentQuery, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        } else {
            console.log(
                "Language Switcher (Admin): No change needed or newLocale is invalid.",
            );
        }
    };

    const drawerContent = (
        /* ... (no changes to drawerContent structure, only ensure props are passed if needed) ... */
        <Box>
            <Toolbar />
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
                <ListItem disablePadding>
                    <ListItemButton
                        component={InertiaLink}
                        href={route("admin.media.index")}
                        selected={route().current("admin.media.*")}
                    >
                        <ListItemIcon>
                            <PhotoLibraryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Media Library" />
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
                        href={route("admin.languages.index")}
                        selected={route().current("admin.languages.*")}
                    >
                        <ListItemIcon>
                            <LanguageIcon />
                        </ListItemIcon>
                        <ListItemText primary="Languages" />
                    </ListItemButton>
                </ListItem>
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
            </List>
            <Divider sx={{ my: 1 }} />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
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
                        {title}
                    </Typography>
                    {availableLocales && availableLocales.length > 1 && (
                        <FormControl
                            variant="standard"
                            size="small"
                            sx={{ minWidth: 70, mr: 2 }}
                        >
                            <Select
                                id="admin-language-select-header"
                                value={currentLocale || ""} // Ensure value is controlled
                                onChange={handleLanguageChange}
                                disableUnderline
                                IconComponent={(props) => (
                                    <LanguageIcon
                                        {...props}
                                        sx={{ mr: -0.5, color: "inherit" }}
                                    />
                                )}
                                renderValue={(value) =>
                                    availableLocales
                                        .find((l) => l.code === value)
                                        ?.code.toUpperCase() || ""
                                }
                                sx={{
                                    color: "inherit",
                                    "& .MuiSelect-icon": { color: "inherit" },
                                    "& .MuiSelect-select": {
                                        pr: 0.5,
                                        py: 0.5,
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "0.875rem",
                                    },
                                }}
                            >
                                {availableLocales.map((lang) => (
                                    <MenuItem
                                        key={`admin-lang-${lang.code}`}
                                        value={lang.code}
                                    >
                                        {lang.native_name} (
                                        {lang.code.toUpperCase()})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <Typography
                        variant="body2"
                        sx={{ mr: 1, display: { xs: "none", sm: "inline" } }}
                    >
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
                    ModalProps={{ keepMounted: true }}
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
                <Toolbar />
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
