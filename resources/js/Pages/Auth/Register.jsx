import React, { useEffect } from "react"; // Added React for hooks
import { Head, Link as InertiaLink, useForm } from "@inertiajs/react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    Link as MuiLink,
} from "@mui/material";
import GuestLayout from "@/Layouts/GuestLayout"; // Already uses MUI

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <Typography
                component="h1"
                variant="h5"
                sx={{ textAlign: "center", mb: 2 }}
            >
                Register
            </Typography>

            <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={processing}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={processing}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={processing}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password_confirmation"
                    label="Confirm Password"
                    type="password"
                    id="password_confirmation"
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    error={!!errors.password_confirmation}
                    helperText={errors.password_confirmation}
                    disabled={processing}
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        mt: 3,
                        mb: 2,
                    }}
                >
                    <MuiLink
                        component={InertiaLink}
                        href={route("login")}
                        variant="body2"
                        sx={{ mr: "auto" }}
                    >
                        Already registered?
                    </MuiLink>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        sx={{ ml: 2 }}
                    >
                        {processing ? "Registering..." : "Register"}
                    </Button>
                </Box>
            </Box>
        </GuestLayout>
    );
}
