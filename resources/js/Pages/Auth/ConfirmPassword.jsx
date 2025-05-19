import React, { useEffect } from "react"; // Added React for hooks
import { Head, useForm } from "@inertiajs/react";
import { TextField, Button, Box, Typography } from "@mui/material";
import GuestLayout from "@/Layouts/GuestLayout"; // Already uses MUI

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("password.confirm"));
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <Typography
                component="h1"
                variant="h5"
                sx={{ textAlign: "center", mb: 2 }}
            >
                Confirm Password
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, textAlign: "center" }}
            >
                This is a secure area of the application. Please confirm your
                password before continuing.
            </Typography>

            <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    autoFocus
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={processing}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={processing}
                >
                    {processing ? "Confirming..." : "Confirm"}
                </Button>
            </Box>
        </GuestLayout>
    );
}
