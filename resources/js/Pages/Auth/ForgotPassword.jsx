import React from "react"; // Added React for hooks
import { Head, useForm } from "@inertiajs/react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import GuestLayout from "@/Layouts/GuestLayout"; // Already uses MUI

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Typography
                component="h1"
                variant="h5"
                sx={{ textAlign: "center", mb: 2 }}
            >
                Forgot Password
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, textAlign: "center" }}
            >
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </Typography>

            {status && (
                <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
                    {status}
                </Alert>
            )}

            <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={processing}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={processing}
                >
                    {processing
                        ? "Sending Link..."
                        : "Email Password Reset Link"}
                </Button>
            </Box>
        </GuestLayout>
    );
}
