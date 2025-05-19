import React from "react"; // Added React for hooks
import { Head, Link as InertiaLink, useForm } from "@inertiajs/react";
import { Button, Box, Typography, Alert, Link as MuiLink } from "@mui/material";
import GuestLayout from "@/Layouts/GuestLayout"; // Already uses MUI

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <Typography
                component="h1"
                variant="h5"
                sx={{ textAlign: "center", mb: 2 }}
            >
                Verify Your Email Address
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, textAlign: "center" }}
            >
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </Typography>

            {status === "verification-link-sent" && (
                <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
                    A new verification link has been sent to the email address
                    you provided during registration.
                </Alert>
            )}

            <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 4,
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                    >
                        {processing
                            ? "Resending..."
                            : "Resend Verification Email"}
                    </Button>

                    <MuiLink
                        component={InertiaLink}
                        href={route("logout")}
                        method="post"
                        as="button" /* Important for InertiaLink to function like a button with method="post" */
                        variant="body2"
                        underline="hover"
                        sx={{
                            color: "text.secondary",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            padding: 0,
                            font: "inherit",
                            "&:hover": {
                                color: "primary.main",
                            },
                        }}
                    >
                        Log Out
                    </MuiLink>
                </Box>
            </Box>
        </GuestLayout>
    );
}
