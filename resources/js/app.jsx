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

const theme = createTheme({
    direction: "rtl",
    palette: {
        primary: { main: "#008080", contrastText: "#ffffff" },
        secondary: { main: "#f5f5dc", contrastText: "#333333" },
        background: { default: "#f5f5dc", paper: "#ffffff" },
        text: { primary: "#333333", secondary: "#555555" },
        error: { main: "#D87093" },
    },
    typography: {
        fontFamily: [
            "Cairo",
            "Tajawal",
            "Noto Sans Arabic",
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
        ].join(","),
        h1: { fontWeight: 700 },
        h2: { fontWeight: 600 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 500 },
        h5: { fontWeight: 500 },
        h6: { fontWeight: 500 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 8, textTransform: "none" },
                containedPrimary: {
                    backgroundColor: "#008080",
                    "&:hover": { backgroundColor: "#006666" },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: { backgroundColor: "#ffffff", color: "#333333" },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                },
            },
        },
    },
});

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
        root.render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <App {...props} />
                </ThemeProvider>
            </LocalizationProvider>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
