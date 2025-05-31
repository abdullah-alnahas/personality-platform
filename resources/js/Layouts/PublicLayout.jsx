import React, { useState, useEffect } from "react";
import {
    Link as InertiaLink,
    usePage,
    useForm,
    router,
} from "@inertiajs/react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Container,
    Link as MuiLink,
    Grid,
    IconButton,
    TextField,
    Button,
    Divider,
    Tooltip,
    Snackbar,
    Alert,
    Menu,
    MenuItem,
    InputAdornment,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import LinkIconOriginal from "@mui/icons-material/Link";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const SocialIcon = ({ platform }) => {
    /* ... (same as before) ... */
    switch (platform?.toLowerCase()) {
        case "facebook":
            return <FacebookIcon />;
        case "x":
            return <TwitterIcon />;
        case "twitter":
            return <TwitterIcon />;
        case "youtube":
            return <YouTubeIcon />;
        case "instagram":
            return <InstagramIcon />;
        case "telegram":
            return <TelegramIcon />;
        case "linkedin":
            return <LinkedInIcon />;
        default:
            return <LinkIconOriginal />;
    }
};
const getTranslatedField = (fieldObject, pageProps, fallback = "") => {
    /* ... (same as before) ... */
    const currentLocale = pageProps.current_locale || "en";
    if (fieldObject == null) return fallback;
    if (typeof fieldObject !== "object") return String(fieldObject) || fallback;
    return (
        fieldObject[currentLocale] ||
        fieldObject[Object.keys(fieldObject)[0]] ||
        fallback
    );
};
const NavLink = ({
    item,
    isMenuItem = false,
    isDrawerItem = false,
    currentLocale,
}) => {
    /* ... (same as before, ensure `pageProps` is passed if `usePage` was used inside) ... */
    const label = getTranslatedField(item.label, {
        current_locale: currentLocale,
    });
    const commonProps = {
        color: isMenuItem || isDrawerItem ? "inherit" : "text.secondary",
        underline: "hover",
        target: item.target,
        rel: item.target === "_blank" ? "noopener noreferrer" : undefined,
        sx: {
            display: "block",
            py: isMenuItem ? 1 : isDrawerItem ? 1.5 : 0.5,
            px: isMenuItem || isDrawerItem ? 2 : isDrawerItem ? 0 : 0.5,
            fontSize: "0.875rem",
            width: "100%",
            textAlign: isDrawerItem ? "left" : "center",
        },
    };
    const isExternal =
        item.url.startsWith("http://") || item.url.startsWith("https://");
    if (isExternal || item.target === "_blank") {
        return (
            <MuiLink href={item.url} {...commonProps}>
                {label}
            </MuiLink>
        );
    } else {
        try {
            if (
                typeof route !== "undefined" &&
                !item.url.includes("/") &&
                route().has(item.url)
            ) {
                return (
                    <MuiLink
                        component={InertiaLink}
                        href={route(item.url)}
                        {...commonProps}
                    >
                        {label}
                    </MuiLink>
                );
            }
        } catch (e) {
            console.warn(`Ziggy route() failed for NavLink name: ${item.url}.`);
        }
        return (
            <MuiLink component={InertiaLink} href={item.url} {...commonProps}>
                {label}
            </MuiLink>
        );
    }
};
const HeaderNavLink = ({ item, currentLocale }) => {
    /* ... (same as before) ... */
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const hasChildren = item.children && item.children.length > 0;
    const handleClick = (event) => {
        if (hasChildren) setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);
    const label = getTranslatedField(item.label, {
        current_locale: currentLocale,
    });
    const commonProps = {
        color: "inherit",
        underline: "hover",
        target: item.target,
        rel: item.target === "_blank" ? "noopener noreferrer" : undefined,
        sx: {
            p: 1,
            textTransform: "none",
            color: "text.primary",
            display: "flex",
            alignItems: "center",
        },
    };
    const isExternal =
        item.url.startsWith("http://") || item.url.startsWith("https://");
    let linkHref = item.url;
    if (!hasChildren && !isExternal) {
        try {
            if (
                typeof route !== "undefined" &&
                !item.url.includes("/") &&
                route().has(item.url)
            )
                linkHref = route(item.url);
        } catch (e) {
            console.warn(
                `Ziggy route() failed for HeaderNavLink name: ${item.url}.`,
            );
        }
    }
    const Component = hasChildren ? Button : MuiLink;
    const componentSpecificProps = hasChildren
        ? {
              onClick: handleClick,
              endIcon: <ArrowDropDownIcon />,
              "aria-controls": open ? `menu-${item.id}` : undefined,
              "aria-haspopup": "true",
              "aria-expanded": open ? "true" : undefined,
          }
        : {
              component:
                  isExternal || item.target === "_blank" ? "a" : InertiaLink,
              href: linkHref,
          };
    return (
        <>
            <Component {...commonProps} {...componentSpecificProps}>
                {label}
            </Component>
            {hasChildren && (
                <Menu
                    id={`menu-${item.id}`}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{ "aria-labelledby": `button-${item.id}` }}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                    {item.children.map((child) => (
                        <MenuItem
                            key={child.id}
                            onClick={handleClose}
                            disableRipple
                            sx={{ p: 0 }}
                        >
                            <NavLink
                                item={child}
                                isMenuItem={true}
                                currentLocale={currentLocale}
                            />
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </>
    );
};

export default function PublicLayout({ children, title: pageTitle }) {
    const {
        socialAccounts,
        auth,
        navigationItems,
        settings,
        flash,
        ziggy,
        available_locales: availableLocales,
        current_locale: currentLocale,
    } = usePage().props;
    const pageProps = usePage().props;
    const {
        data: subData,
        setData: setSubData,
        post: subPost,
        processing: subProcessing,
        errors: subErrors,
        reset: subReset,
        recentlySuccessful: subRecentlySuccessful,
    } = useForm({ email: "" });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const siteName = getTranslatedField(
        settings?.site_name?.value,
        pageProps,
        "Personality Platform",
    );
    const headerNavItems = navigationItems?.header ?? [];
    const footerCol1Items =
        navigationItems?.footer_col1?.filter((item) => !item.parent_id) ?? [];
    const footerCol2Items =
        navigationItems?.footer_col2?.filter((item) => !item.parent_id) ?? [];
    const [searchQuery, setSearchQuery] = useState(ziggy?.query?.q || "");
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => setMobileOpen((prevState) => !prevState);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim())
            router.get(
                route("search"),
                { q: searchQuery },
                {
                    preserveState: true,
                    replace: route().current("search"),
                    onSuccess: () => setMobileOpen(false),
                },
            );
    };
    useEffect(() => {
        if (subRecentlySuccessful) subReset("email");
    }, [subRecentlySuccessful, subReset]);
    const handleSubscribe = (e) => {
        e.preventDefault();
        subPost(route("subscribe"), { preserveScroll: true });
    };
    useEffect(() => {
        const successMessage = flash?.success;
        const errorMessage = flash?.error;
        const subEmailError = subErrors?.email;
        if (successMessage) {
            setSnackbarMessage(successMessage);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } else if (errorMessage) {
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } else if (subEmailError && !subRecentlySuccessful) {
            setSnackbarMessage(subEmailError);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    }, [flash, subErrors, subRecentlySuccessful]);
    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;
        setSnackbarOpen(false);
    };
    useEffect(() => {
        setSearchQuery(ziggy?.query?.q || "");
    }, [ziggy?.query?.q]);
    const handleLanguageChange = (event) => {
        /* ... (same as before, with console logs) ... */
        const newLocale = event.target.value;
        console.log(
            "Language Switcher (Public): Attempting to change language.",
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
            console.log("Navigating to URL (Public):", baseUrl);
            console.log("With query params (Public):", currentQuery);
            router.get(baseUrl, currentQuery, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        } else {
            console.log(
                "Language Switcher (Public): No change needed or newLocale is invalid.",
            );
        }
    };
    const getDrawerLinkHref = (url) => {
        /* ... (same as before) ... */ if (!url) return "#";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        if (
            typeof route !== "undefined" &&
            !url.includes("/") &&
            route().has(url)
        ) {
            try {
                return route(url);
            } catch (e) {
                console.warn(
                    `Ziggy route() failed for drawer link name: ${url}.`,
                );
            }
        }
        return url;
    };
    const getDrawerLinkComponent = (url) => {
        /* ... (same as before) ... */ if (
            !url ||
            url.startsWith("http://") ||
            url.startsWith("https://")
        )
            return "a";
        return InertiaLink;
    };
    const drawer = (
        /* ... (same drawer content as before) ... */
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h6" sx={{ my: 0 }}>
                    {siteName}
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                <ListItem>
                    <Box
                        component="form"
                        onSubmit={handleSearchSubmit}
                        sx={{ width: "100%" }}
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                    </Box>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                {headerNavItems.map((item) => (
                    <ListItem
                        key={`drawer-${item.id}`}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <ListItemButton
                            component={getDrawerLinkComponent(item.url)}
                            href={getDrawerLinkHref(item.url)}
                            {...(getDrawerLinkComponent(item.url) === "a" && {
                                target: item.target || "_blank",
                                rel: "noopener noreferrer",
                            })}
                            sx={{ textAlign: "left", width: "100%" }}
                        >
                            <ListItemText
                                primary={getTranslatedField(
                                    item.label,
                                    pageProps,
                                )}
                            />
                        </ListItemButton>
                        {item.children && item.children.length > 0 && (
                            <List component="div" disablePadding sx={{ pl: 2 }}>
                                {item.children.map((child) => (
                                    <ListItem
                                        key={`drawer-child-${child.id}`}
                                        disablePadding
                                    >
                                        <ListItemButton
                                            dense
                                            component={getDrawerLinkComponent(
                                                child.url,
                                            )}
                                            href={getDrawerLinkHref(child.url)}
                                            {...(getDrawerLinkComponent(
                                                child.url,
                                            ) === "a" && {
                                                target:
                                                    child.target || "_blank",
                                                rel: "noopener noreferrer",
                                            })}
                                            sx={{
                                                textAlign: "left",
                                                width: "100%",
                                            }}
                                        >
                                            <ListItemText
                                                primary={getTranslatedField(
                                                    child.label,
                                                    pageProps,
                                                )}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                {availableLocales && availableLocales.length > 1 && (
                    <ListItem disablePadding sx={{ px: 1 }}>
                        <FormControl
                            variant="standard"
                            fullWidth
                            sx={{ my: 1, minWidth: 120 }}
                        >
                            <InputLabel
                                shrink={false}
                                id="drawer-language-select-label"
                                sx={{
                                    position: "static",
                                    transform: "none",
                                    mb: 0.5,
                                    fontSize: "0.875rem",
                                    color: "text.secondary",
                                }}
                            >
                                Language
                            </InputLabel>
                            <Select
                                labelId="drawer-language-select-label"
                                id="drawer-language-select"
                                value={currentLocale || ""}
                                onChange={handleLanguageChange}
                                disableUnderline
                            >
                                {availableLocales.map((lang) => (
                                    <MenuItem
                                        key={`drawer-lang-${lang.code}`}
                                        value={lang.code}
                                    >
                                        {lang.native_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>
                )}
                <Divider sx={{ my: 1 }} />
                {auth.user ? (
                    <ListItem disablePadding>
                        <ListItemButton
                            component={InertiaLink}
                            href={route("admin.dashboard")}
                            sx={{ textAlign: "left" }}
                        >
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                ) : (
                    <>
                        {route().has("login") && (
                            <ListItem disablePadding>
                                <ListItemButton
                                    component={InertiaLink}
                                    href={route("login")}
                                    sx={{ textAlign: "left" }}
                                >
                                    <ListItemText primary="Login" />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <AppBar
                position="static"
                color="default"
                elevation={1}
                sx={{ bgcolor: "background.paper" }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        {/* ... (AppBar content same as before) ... */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component={InertiaLink}
                            href={route("home")}
                            sx={{
                                textDecoration: "none",
                                color: "inherit",
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                alignItems: "center",
                            }}
                        >
                            {siteName}
                        </Typography>
                        <Typography
                            variant="h6"
                            component={InertiaLink}
                            href={route("home")}
                            sx={{
                                textDecoration: "none",
                                color: "inherit",
                                flexGrow: { xs: 1, md: 0 },
                                display: { xs: "flex", md: "none" },
                                alignItems: "center",
                            }}
                        >
                            {siteName}
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                                gap: 0.5,
                                justifyContent: "center",
                            }}
                        >
                            {headerNavItems.map((item) => (
                                <HeaderNavLink
                                    key={item.id}
                                    item={item}
                                    currentLocale={currentLocale}
                                />
                            ))}
                        </Box>
                        <Box
                            component="form"
                            onSubmit={handleSearchSubmit}
                            sx={{
                                mr: { xs: 0, md: 1 },
                                ml: { xs: 1, md: 0 },
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Search…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        {availableLocales && availableLocales.length > 1 && (
                            <FormControl
                                variant="standard"
                                size="small"
                                sx={{
                                    minWidth: 70,
                                    display: { xs: "none", md: "inline-flex" },
                                    ml: 1,
                                }}
                            >
                                <Select
                                    id="public-language-select-header"
                                    value={currentLocale || ""}
                                    onChange={handleLanguageChange}
                                    disableUnderline
                                    IconComponent={(props) => (
                                        <LanguageIcon
                                            {...props}
                                            sx={{
                                                color: "action.active",
                                                transform: "none",
                                            }}
                                        />
                                    )}
                                    renderValue={(value) =>
                                        availableLocales
                                            .find((l) => l.code === value)
                                            ?.code.toUpperCase() || ""
                                    }
                                    sx={{
                                        color: "text.secondary",
                                        "& .MuiSelect-icon": {
                                            color: "text.secondary",
                                        },
                                        "& .MuiSelect-select": {
                                            pr: 0.5,
                                            py: 0.5,
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "0.875rem",
                                            backgroundColor: "transparent",
                                        },
                                    }}
                                >
                                    {availableLocales.map((lang) => (
                                        <MenuItem
                                            key={`public-lang-${lang.code}`}
                                            value={lang.code}
                                        >
                                            {lang.native_name} (
                                            {lang.code.toUpperCase()})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <Box
                            sx={{ display: { xs: "none", md: "block" }, ml: 1 }}
                        >
                            {auth.user ? (
                                <Button
                                    component={InertiaLink}
                                    href={route("admin.dashboard")}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                route().has("login") && (
                                    <Button
                                        component={InertiaLink}
                                        href={route("login")}
                                        color="primary"
                                        variant="text"
                                        size="small"
                                    >
                                        Login
                                    </Button>
                                )
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: 280,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Container
                component="main"
                maxWidth="lg"
                sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: 4, flexGrow: 1 }}
            >
                {children}
            </Container>
            <Box
                component="footer"
                sx={{
                    bgcolor: "background.paper",
                    py: 6,
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="space-between">
                        <Grid xs={12} md={4}>
                            {" "}
                            {/* Grid v2 */}
                            <Typography variant="h6" gutterBottom>
                                {siteName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {getTranslatedField(
                                    settings?.site_description?.value,
                                    pageProps,
                                    "Sharing knowledge and insights.",
                                )}
                            </Typography>
                        </Grid>
                        {footerCol1Items.length > 0 && (
                            <Grid xs={6} sm={3} md={2}>
                                {" "}
                                {/* Grid v2 */}{" "}
                                <Typography variant="subtitle1" gutterBottom>
                                    Links
                                </Typography>
                                {footerCol1Items.map((item) => (
                                    <NavLink
                                        key={`footer1-${item.id}`}
                                        item={item}
                                        currentLocale={currentLocale}
                                    />
                                ))}
                            </Grid>
                        )}
                        {footerCol2Items.length > 0 && (
                            <Grid xs={6} sm={3} md={2}>
                                {" "}
                                {/* Grid v2 */}{" "}
                                <Typography variant="subtitle1" gutterBottom>
                                    Resources
                                </Typography>
                                {footerCol2Items.map((item) => (
                                    <NavLink
                                        key={`footer2-${item.id}`}
                                        item={item}
                                        currentLocale={currentLocale}
                                    />
                                ))}
                            </Grid>
                        )}
                        <Grid xs={12} md={4}>
                            {" "}
                            {/* Grid v2 */}
                            {socialAccounts && socialAccounts.length > 0 && (
                                <>
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Connect
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        {socialAccounts.map((acc) => (
                                            <Tooltip
                                                title={
                                                    getTranslatedField(
                                                        acc.account_name,
                                                        pageProps,
                                                    ) || acc.platform
                                                }
                                                key={acc.id}
                                            >
                                                <span>
                                                    <IconButton
                                                        component="a"
                                                        href={acc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        color="inherit"
                                                        aria-label={
                                                            getTranslatedField(
                                                                acc.account_name,
                                                                pageProps,
                                                            ) || acc.platform
                                                        }
                                                        disabled={!acc.url}
                                                    >
                                                        <SocialIcon
                                                            platform={
                                                                acc.platform
                                                            }
                                                        />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        ))}
                                    </Box>
                                </>
                            )}
                            <Typography variant="subtitle1" gutterBottom>
                                Subscribe
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleSubscribe}
                                noValidate
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Email Address"
                                    variant="outlined"
                                    type="email"
                                    value={subData.email}
                                    onChange={(e) =>
                                        setSubData("email", e.target.value)
                                    }
                                    required
                                    sx={{ mb: 1 }}
                                    error={!!subErrors.email}
                                    helperText={subErrors.email}
                                    disabled={subProcessing}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="medium"
                                    disabled={subProcessing}
                                >
                                    {subProcessing
                                        ? "Subscribing..."
                                        : "Subscribe"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 4 }} />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                    >
                        {getTranslatedField(
                            settings?.footer_copyright_text?.value,
                            pageProps,
                            `© {year} ${siteName}. All rights reserved.`,
                        ).replace("{year}", new Date().getFullYear())}
                    </Typography>
                </Container>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
