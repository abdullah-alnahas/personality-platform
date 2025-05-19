import React from "react";
import ApplicationLogo from "@/Components/ApplicationLogo"; // Assuming this is a style-agnostic SVG logo
import { Link as InertiaLink } from "@inertiajs/react";
import {
    Container,
    Box,
    Paper,
    CssBaseline,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import { usePage } from "@inertiajs/react"; // To access theme from props if available

// A minimal theme for guest pages, can be expanded or use the main theme
// For now, using a simple theme, assuming main theme is in Public/Admin layouts
const guestTheme = createTheme({
    palette: {
        mode: "light", // Or 'dark' based on preference
        background: {
            default: "#f4f6f8", // A light grey background
        },
        primary: {
            main: "#008080", // Example primary color, align with app.jsx
        },
    },
    typography: {
        fontFamily:
            '"Cairo", "Tajawal", "Noto Sans Arabic", "Roboto", "Helvetica Neue", Arial, sans-serif',
    },
});

export default function GuestLayout({ children }) {
    // Check if a theme is passed via page props, otherwise use default guestTheme
    // This allows for potential theme sharing from app.jsx if GuestLayout is wrapped differently later
    const { muiTheme: pageTheme } = usePage().props;
    const activeTheme = pageTheme || guestTheme;

    return (
        <ThemeProvider theme={activeTheme}>
            <CssBaseline />
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <InertiaLink href="/">
                        <ApplicationLogo
                            sx={{ m: 1, width: "auto", height: 50 }}
                        />
                    </InertiaLink>
                    <Paper
                        elevation={3}
                        sx={{
                            mt: 3,
                            p: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%", // Ensure paper takes full width of container
                        }}
                    >
                        {children}
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
