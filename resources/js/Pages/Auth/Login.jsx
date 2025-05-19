import React, { useEffect } from "react"; // Added React for hooks
import { Head, Link as InertiaLink, useForm } from "@inertiajs/react";
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Box,
    Typography,
    Grid,
    Alert,
    Link as MuiLink,
} from "@mui/material";
import GuestLayout from "@/Layouts/GuestLayout"; // Already uses MUI

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
                    {status}
                </Alert>
            )}

            <Typography
                component="h1"
                variant="h5"
                sx={{ textAlign: "center", mb: 2 }}
            >
                Log in
            </Typography>

            <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
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
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={processing}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            color="primary"
                            disabled={processing}
                        />
                    }
                    label="Remember me"
                    sx={{ mt: 1, mb: 1 }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={processing}
                >
                    {processing ? "Logging in..." : "Log in"}
                </Button>
                <Grid container>
                    {canResetPassword && (
                        <Grid item xs>
                            <MuiLink
                                component={InertiaLink}
                                href={route("password.request")}
                                variant="body2"
                            >
                                Forgot your password?
                            </MuiLink>
                        </Grid>
                    )}
                    {route().has("register") && (
                        <Grid item>
                            <MuiLink
                                component={InertiaLink}
                                href={route("register")}
                                variant="body2"
                            >
                                {"Don't have an account? Sign Up"}
                            </MuiLink>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </GuestLayout>
    );
}
