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

            // Islamic design palette
            const islamicColors = {
                darkGreen: '#2B3D2F',
                deepGreen: '#1E2A22',
                olive: '#6B7B4C',
                oliveLight: '#8B9A6B',
                cream: '#F5F0E8',
                creamLight: '#FAF7F2',
                gold: '#C9A94E',
                goldLight: '#D4B96A',
                warmWhite: '#FEFCF8',
            };

            const headingFontFamily = direction === 'rtl'
                ? "'Amiri', 'Traditional Arabic', 'Tajawal', serif"
                : "'Amiri', 'Georgia', 'Times New Roman', serif";

            const bodyFontFamily = [
                ...(direction === "rtl"
                    ? ["Tajawal", "Noto Sans Arabic"]
                    : []),
                "Cairo",
                "Roboto",
                '"Helvetica Neue"',
                "Arial",
                "sans-serif",
            ].join(",");

            return createTheme({
                direction: direction,
                palette: {
                    primary: { main: islamicColors.darkGreen, light: islamicColors.olive, dark: islamicColors.deepGreen, contrastText: '#ffffff' },
                    secondary: { main: islamicColors.gold, light: islamicColors.goldLight, contrastText: '#1a1a1a' },
                    background: { default: islamicColors.cream, paper: '#FFFFFF' },
                    text: { primary: '#2C2C2C', secondary: '#5A5A5A' },
                    error: { main: '#D32F2F' },
                    islamic: islamicColors,
                },
                typography: {
                    fontFamily: bodyFontFamily,
                    h1: { fontFamily: headingFontFamily, fontWeight: 700, fontSize: direction === 'rtl' ? '3.2rem' : '2.8rem', lineHeight: 1.3 },
                    h2: { fontFamily: headingFontFamily, fontWeight: 700, fontSize: direction === 'rtl' ? '2.5rem' : '2.2rem', lineHeight: 1.3 },
                    h3: { fontFamily: headingFontFamily, fontWeight: 600, fontSize: direction === 'rtl' ? '2.0rem' : '1.8rem', lineHeight: 1.4 },
                    h4: { fontFamily: headingFontFamily, fontWeight: 600, fontSize: direction === 'rtl' ? '1.7rem' : '1.5rem', lineHeight: 1.4 },
                    h5: { fontFamily: headingFontFamily, fontWeight: 500, fontSize: direction === 'rtl' ? '1.4rem' : '1.25rem', lineHeight: 1.5 },
                    h6: { fontFamily: headingFontFamily, fontWeight: 500, fontSize: direction === 'rtl' ? '1.15rem' : '1.0rem', lineHeight: 1.5 },
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                textTransform: 'none',
                                fontWeight: 500,
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: '#FFFFFF',
                                color: '#2C2C2C',
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 12,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            },
                        },
                    },
                    MuiTextField: { defaultProps: { variant: 'outlined' } },
                    MuiSelect: { defaultProps: { variant: 'outlined' } },
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
        color: "#2B3D2F",
    },
});
