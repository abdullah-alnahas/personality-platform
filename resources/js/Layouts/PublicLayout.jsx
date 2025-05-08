import React, { useState, useEffect } from "react";
import {
    Link as InertiaLink,
    usePage,
    useForm,
    router,
} from "@inertiajs/react"; // Added router import
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
    Tooltip, // Keep Tooltip
    Snackbar,
    Alert,
    Menu,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter"; // Keep Twitter for X
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn"; // Keep LinkedIn
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LinkIcon from "@mui/icons-material/Link";
import SearchIcon from "@mui/icons-material/Search";

// SocialIcon component remains the same
const SocialIcon = ({ platform }) => {
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
            return <LinkIcon />;
    }
};

// getTranslatedField helper remains the same
const getTranslatedField = (fieldObject, locale = "en", fallback = "") => {
    const { props } = usePage();
    const currentLocale = props.locale || locale;
    if (fieldObject == null) {
        return fallback;
    }
    if (typeof fieldObject !== "object") {
        return String(fieldObject) || fallback;
    }
    return (
        fieldObject[currentLocale] ||
        fieldObject[locale] ||
        Object.values(fieldObject)[0] ||
        fallback
    );
};

// NavLink component remains the same
const NavLink = ({ item, isMenuItem = false }) => {
    const label = getTranslatedField(item.label);
    const commonProps = {
        color: isMenuItem ? "inherit" : "text.secondary",
        underline: "hover",
        target: item.target,
        rel: item.target === "_blank" ? "noopener noreferrer" : undefined,
        sx: {
            display: "block",
            py: isMenuItem ? 1 : 0.5,
            px: isMenuItem ? 2 : 0,
            fontSize: "0.875rem",
            width: "100%",
            textAlign: "left",
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
            if (typeof route !== "undefined" && !item.url.includes("/")) {
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
            console.warn(
                `Ziggy route() failed for URL: ${item.url}. Falling back to direct path.`,
            );
        }
        return (
            <MuiLink component={InertiaLink} href={item.url} {...commonProps}>
                {label}
            </MuiLink>
        );
    }
};

// HeaderNavLink component remains the same
const HeaderNavLink = ({ item }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const hasChildren = item.children && item.children.length > 0;
    const handleClick = (event) => {
        if (hasChildren) {
            setAnchorEl(event.currentTarget);
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const label = getTranslatedField(item.label);
    const commonProps = {
        color: "inherit",
        underline: "hover",
        target: item.target,
        rel: item.target === "_blank" ? "noopener noreferrer" : undefined,
        sx: { p: 1, textTransform: "none", color: "text.primary" },
    };
    const isExternal =
        item.url.startsWith("http://") || item.url.startsWith("https://");
    const Component = hasChildren ? Button : MuiLink;
    let linkHref = item.url;
    if (!hasChildren && !isExternal) {
        try {
            if (typeof route !== "undefined" && !item.url.includes("/")) {
                linkHref = route(item.url);
            }
        } catch (e) {
            console.warn(
                `Ziggy route() failed for header URL: ${item.url}. Falling back to direct path.`,
            );
            linkHref = item.url;
        }
    }
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
            {" "}
            <Component {...commonProps} {...componentSpecificProps}>
                {" "}
                {label}{" "}
            </Component>{" "}
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
                    {" "}
                    {item.children.map((child) => (
                        <MenuItem
                            key={child.id}
                            onClick={handleClose}
                            disableRipple
                            sx={{ p: 0 }}
                        >
                            {" "}
                            <NavLink item={child} isMenuItem={true} />{" "}
                        </MenuItem>
                    ))}{" "}
                </Menu>
            )}{" "}
        </>
    );
};

export default function PublicLayout({ children }) {
    const {
        socialAccounts,
        auth,
        errors: pageErrors,
        navigationItems,
        settings,
        flash,
        query: currentSearchQuery,
        locale: currentLocale,
    } = usePage().props; // Added locale
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
        currentLocale,
        "Personality Platform",
    ); // Use currentLocale
    const headerNavItems = navigationItems?.header ?? [];
    const footerCol1Items =
        navigationItems?.footer_col1?.filter((item) => !item.parent_id) ?? [];
    const footerCol2Items =
        navigationItems?.footer_col2?.filter((item) => !item.parent_id) ?? [];
    const [searchQuery, setSearchQuery] = useState(currentSearchQuery || "");
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(
                route("search"),
                { q: searchQuery },
                { preserveState: true, replace: route().current("search") },
            );
        }
    };
    useEffect(() => {
        if (subRecentlySuccessful) {
            subReset("email");
        }
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
        setSearchQuery(currentSearchQuery || "");
    }, [currentSearchQuery]);

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
                        <Typography
                            variant="h6"
                            component={InertiaLink}
                            href={route("home")}
                            sx={{
                                textDecoration: "none",
                                color: "inherit",
                                mr: 2,
                            }}
                        >
                            {" "}
                            {siteName}{" "}
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                                gap: 1,
                            }}
                        >
                            {" "}
                            {headerNavItems.map((item) => (
                                <HeaderNavLink key={item.id} item={item} />
                            ))}{" "}
                        </Box>
                        <Box
                            component="form"
                            onSubmit={handleSearchSubmit}
                            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
                        >
                            {" "}
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Search…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {" "}
                                            <SearchIcon />{" "}
                                        </InputAdornment>
                                    ),
                                }}
                            />{" "}
                        </Box>
                        {auth.user ? (
                            <Button
                                component={InertiaLink}
                                href={route("admin.dashboard")}
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ ml: "auto" }}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            <Box sx={{ ml: "auto" }}></Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            <Container
                component="main"
                maxWidth="lg"
                sx={{ mt: 4, mb: 4, flexGrow: 1 }}
            >
                {" "}
                {children}{" "}
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
                    {/* Grid container - Removed 'item' prop from children */}
                    <Grid container spacing={4} justifyContent="space-between">
                        {/* Grid item - Removed 'item' prop */}
                        <Grid xs={12} md={4}>
                            {" "}
                            {/* Use direct responsive props */}
                            <Typography variant="h6" gutterBottom>
                                {siteName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {" "}
                                Sharing knowledge and insights.{" "}
                            </Typography>
                        </Grid>
                        {footerCol1Items.length > 0 && (
                            /* Grid item - Removed 'item' prop */
                            <Grid xs={6} sm={3} md={2}>
                                {" "}
                                {/* Use direct responsive props */}
                                <Typography variant="subtitle1" gutterBottom>
                                    Links
                                </Typography>
                                {footerCol1Items.map((item) => (
                                    <NavLink key={item.id} item={item} />
                                ))}
                            </Grid>
                        )}
                        {footerCol2Items.length > 0 && (
                            /* Grid item - Removed 'item' prop */
                            <Grid xs={6} sm={3} md={2}>
                                {" "}
                                {/* Use direct responsive props */}
                                <Typography variant="subtitle1" gutterBottom>
                                    Resources
                                </Typography>
                                {footerCol2Items.map((item) => (
                                    <NavLink key={item.id} item={item} />
                                ))}
                            </Grid>
                        )}
                        {/* Grid item - Removed 'item' prop */}
                        <Grid xs={12} md={4}>
                            {" "}
                            {/* Use direct responsive props */}
                            {socialAccounts && socialAccounts.length > 0 && (
                                <>
                                    {" "}
                                    <Typography
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Connect
                                    </Typography>{" "}
                                    <Box sx={{ mb: 2 }}>
                                        {socialAccounts.map((acc) => (
                                            // ** Tooltip Fix: Wrap IconButton in a span **
                                            <Tooltip
                                                title={
                                                    getTranslatedField(
                                                        acc.account_name,
                                                        currentLocale,
                                                    ) || acc.platform
                                                }
                                                key={acc.id}
                                            >
                                                <span>
                                                    {" "}
                                                    {/* <-- Add wrapper span */}
                                                    <IconButton
                                                        component="a"
                                                        href={acc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        color="inherit"
                                                        aria-label={
                                                            getTranslatedField(
                                                                acc.account_name,
                                                                currentLocale,
                                                            ) || acc.platform
                                                        }
                                                        // Disable button if href is invalid/missing (optional)
                                                        disabled={!acc.url}
                                                    >
                                                        <SocialIcon
                                                            platform={
                                                                acc.platform
                                                            }
                                                        />
                                                    </IconButton>
                                                </span>
                                                {/* <-- Close wrapper span */}
                                            </Tooltip>
                                        ))}
                                    </Box>{" "}
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
                                    {" "}
                                    {subProcessing
                                        ? "Subscribing..."
                                        : "Subscribe"}{" "}
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
                        {" "}
                        {"© "} {new Date().getFullYear()} {siteName}. All
                        rights reserved.{" "}
                    </Typography>
                </Container>
            </Box>
            {/* Snackbar remains the same */}
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
                    {" "}
                    {snackbarMessage}{" "}
                </Alert>
            </Snackbar>
        </Box>
    );
}
