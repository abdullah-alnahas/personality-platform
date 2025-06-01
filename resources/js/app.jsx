import "./bootstrap";
import "../css/app.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-quill/dist/quill.snow.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// No need to import useLocale here, it will be used by components

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const createAppTheme = (pageProps) => {
            // Access locale info from pageProps, which should be updated by Inertia
            const currentLocaleCode = pageProps?.current_locale || "en";
            const availableLocales = pageProps?.available_locales || [];
            const currentSelectedLocale = availableLocales.find(
                (lang) => lang.code === currentLocaleCode,
            );
            const direction = currentSelectedLocale?.is_rtl ? "rtl" : "ltr";

            document.documentElement.dir = direction;
            document.documentElement.lang = currentLocaleCode;

            return createTheme({
                direction: direction,
                palette: {
                    primary: { main: "#008080", contrastText: "#ffffff" },
                    secondary: { main: "#D8BFD8", contrastText: "#333333" },
                    background: { default: "#FAF0E6", paper: "#FFFFFF" },
                    text: { primary: "#4A4A4A", secondary: "#707070" },
                    error: { main: "#D32F2F" },
                },
                typography: {
                    fontFamily: [
                        ...(direction === "rtl"
                            ? ["Tajawal", "Noto Sans Arabic"]
                            : []),
                        "Cairo",
                        "Roboto",
                        '"Helvetica Neue"',
                        "Arial",
                        "sans-serif",
                    ].join(","),
                    h1: { fontWeight: 700, fontSize: "2.8rem" },
                    h2: { fontWeight: 600, fontSize: "2.2rem" },
                    h3: { fontWeight: 600, fontSize: "1.8rem" },
                    h4: { fontWeight: 500, fontSize: "1.5rem" },
                    h5: { fontWeight: 500, fontSize: "1.25rem" },
                    h6: { fontWeight: 500, fontSize: "1.0rem" },
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                textTransform: "none",
                                fontWeight: 500,
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: "#FFFFFF",
                                color: "#4A4A4A",
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 12,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            },
                        },
                    },
                    MuiTextField: { defaultProps: { variant: "outlined" } },
                    MuiSelect: { defaultProps: { variant: "outlined" } },
                },
            });
        };

        // DynamicThemeProvider re-creates theme when relevant props change.
        const DynamicThemeProvider = ({ children, pageProps }) => {
            // Use React.useMemo to recreate the theme only when locale-related props change.
            // The key for re-rendering is now explicitly tied to current_locale and available_locales from pageProps.
            const theme = React.useMemo(
                () => createAppTheme(pageProps),
                [pageProps?.current_locale, pageProps?.available_locales], // Ensure these are stable references or correctly updated
            );
            return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
        };

        // props.initialPage.props contains the props for the first page.
        // The App component will receive updated props for subsequent pages.
        root.render(
            <DynamicThemeProvider pageProps={props.initialPage.props}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CssBaseline />
                    <App {...props} />
                </LocalizationProvider>
            </DynamicThemeProvider>,
        );
    },
    progress: {
        color: "#008080",
    },
});
