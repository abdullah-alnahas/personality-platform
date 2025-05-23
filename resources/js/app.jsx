import "./bootstrap";
import "../css/app.css"; // Keep this if it contains any non-Tailwind global styles or font imports for MUI

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

        // Function to create theme dynamically based on current locale's RTL status
        const createAppTheme = (pageProps) => {
            const currentLocaleCode = pageProps.current_locale || "en";
            const availableLocales = pageProps.available_locales || [];
            const currentSelectedLocale = availableLocales.find(
                (lang) => lang.code === currentLocaleCode,
            );
            const direction = currentSelectedLocale?.is_rtl ? "rtl" : "ltr";

            // Ensure HTML dir attribute is set
            document.documentElement.dir = direction;
            document.documentElement.lang = currentLocaleCode;

            return createTheme({
                direction: direction, // Set direction dynamically
                palette: {
                    primary: { main: "#008080", contrastText: "#ffffff" }, // Teal-ish
                    secondary: { main: "#D8BFD8", contrastText: "#333333" }, // Thistle, a light purple/pink
                    background: { default: "#FAF0E6", paper: "#FFFFFF" }, // Linen background, white paper
                    text: { primary: "#4A4A4A", secondary: "#707070" }, // Darker grays for text
                    error: { main: "#D32F2F" }, // Standard MUI error red
                    // You can add more custom colors or MUI's color utilities here
                },
                typography: {
                    fontFamily: [
                        // Prioritize fonts based on direction or specific language needs if necessary
                        ...(direction === "rtl"
                            ? ["Tajawal", "Noto Sans Arabic"]
                            : []), // Arabic fonts first for RTL
                        "Cairo", // Good general Arabic/Latin font
                        "Roboto", // Common Latin fallback
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
                            containedPrimary: {
                                // backgroundColor: "#008080", // Set by palette
                                // "&:hover": { backgroundColor: "#006666" },
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: "#FFFFFF",
                                color: "#4A4A4A",
                            }, // Use paper color for AppBar
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 12,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)", // Softer shadow
                            },
                        },
                    },
                    MuiTextField: {
                        defaultProps: {
                            variant: "outlined", // Default variant for all TextFields
                        },
                    },
                    MuiSelect: {
                        defaultProps: {
                            variant: "outlined",
                        },
                    },
                    // Add other component customizations here
                },
            });
        };

        // Note: The 'props' in setup({ el, App, props }) are the initial page props.
        // The App component itself will receive updated props on subsequent navigations.
        // We need the ThemeProvider to be reactive to prop changes if the App component re-renders.
        // This is typically handled by Inertia's <App {...props} /> structure.
        // The theme creation can happen inside a small wrapper component if needed,
        // or directly within the App component if it's structured to re-create the theme on prop changes.

        // For simplicity and directness, let's ensure the App re-renders with a new theme if props change.
        // A common pattern is to define the theme based on props *inside* the render method of a component
        // that wraps <App /> or by having <App /> itself manage this.
        // The `createInertiaApp`'s `App` component automatically re-renders with new page props.
        // So, we can pass the theme creation function or the theme itself based on initial props,
        // and subsequent renders of `App` will use updated props.

        // Let's refine this: The `App` component provided by `createInertiaApp` will receive updated `props`.
        // We should ideally re-create the theme when `props.page.props.current_locale` changes.
        // A simple way is to make a small wrapper component that does this.

        const DynamicThemeProvider = ({ children, pageProps }) => {
            const theme = React.useMemo(
                () => createAppTheme(pageProps),
                [pageProps.current_locale, pageProps.available_locales],
            );
            return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
        };

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
        color: "#008080", // Primary color for progress bar
    },
});
