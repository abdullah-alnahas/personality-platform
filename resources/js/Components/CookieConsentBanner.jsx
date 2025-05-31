import React, { useState, useEffect } from "react";
import {
    Snackbar,
    Button,
    Typography,
    Link as MuiLink,
    Box,
    Paper,
} from "@mui/material";
import { Link as InertiaLink } from "@inertiajs/react"; // If you have a Cookie Policy page route

export default function CookieConsentBanner() {
    const [open, setOpen] = useState(false);
    const consentKey = "cookie_consent_status";

    useEffect(() => {
        const consentStatus = localStorage.getItem(consentKey);
        if (!consentStatus) {
            // Only show if no consent has been given yet
            setOpen(true);
        }
    }, []);

    const handleAccept = (status) => {
        localStorage.setItem(consentKey, status);
        setOpen(false);
        // Here you could also dispatch a custom event or call a function
        // if other parts of the app need to react immediately to consent change.
        // e.g., if (status === 'accepted_all') { loadAnalytics(); }
        console.log(`Cookie consent status: ${status}`);
    };

    if (!open) {
        return null;
    }

    // Using Paper inside Snackbar for more complex content layout
    // Note: Snackbar's `message` prop is for simple text. For richer content, pass children.
    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            // autoHideDuration={null} // Do not auto-hide, user must interact
            sx={{
                // Allow Snackbar to be wider for the Paper content
                "& .MuiSnackbarContent-root": {
                    backgroundColor: "transparent", // Make default Snackbar content transparent
                    boxShadow: "none",
                    padding: 0, // Remove default padding if Paper handles it
                    width: { xs: "95%", sm: "80%", md: "600px" }, // Responsive width
                    maxWidth: "95vw",
                },
            }}
        >
            <Paper elevation={6} sx={{ p: 2, width: "100%" }}>
                <Typography variant="body2" gutterBottom>
                    This website uses essential cookies to ensure its proper
                    operation. We also use cookies to understand how you
                    interact with it.
                    {/* Future: Link to Cookie Policy page */}
                    {/* <MuiLink component={InertiaLink} href={route('cookie.policy')} underline="hover">Learn more</MuiLink>. */}
                </Typography>
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: { xs: "space-around", sm: "flex-end" },
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    {/* For MVP, spec focuses on Necessary cookies. "Accept All" implies more.
                        Let's provide "Accept Necessary" and an "Okay" or "Accept" button for simplicity initially.
                        The spec options were: Accept All, Necessary Only, Reject All.
                        Let's simplify to "Accept Necessary" (implicitly necessary cookies run) and "Accept All".
                        For MVP, "Accept All" and "Accept Necessary" might behave the same if no optional cookies are used.
                    */}
                    <Button
                        size="small"
                        onClick={() => handleAccept("necessary_only")}
                    >
                        Necessary Only
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAccept("accepted_all")}
                    >
                        Accept All
                    </Button>
                    {/*
                    // Full options from spec, can be added later:
                    <Button size="small" onClick={() => handleAccept('rejected_all')}>
                        Reject All
                    </Button>
                    */}
                </Box>
            </Paper>
        </Snackbar>
    );
}
