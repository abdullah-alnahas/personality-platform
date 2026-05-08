import React, { useEffect } from "react";
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
import GuestLayout from "@/Layouts/GuestLayout";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
        _confirm_email: "", // honeypot — must stay empty; bots fill it, humans don't
    });
    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);
    const submit = (e) => {
        e.preventDefault();
        post(route("admin.login"));
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
                {/* Honeypot: visually hidden, real users never fill this */}
                <Box
                    component="input"
                    type="text"
                    name="_confirm_email"
                    value={data._confirm_email}
                    onChange={(e) => setData("_confirm_email", e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    sx={{
                        position: "absolute",
                        left: "-9999px",
                        width: 1,
                        height: 1,
                        opacity: 0,
                        overflow: "hidden",
                        pointerEvents: "none",
                    }}
                />
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
                    {" "}
                    {/* Grid container for links */}
                    {canResetPassword && (
                        <Grid xs>
                            {" "}
                            {/* Grid item */}
                            <MuiLink
                                component={InertiaLink}
                                href={route("admin.password.request")}
                                variant="body2"
                            >
                                Forgot your password?
                            </MuiLink>
                        </Grid>
                    )}
                    {route().has("register") && (
                        <Grid textAlign="right" xs>
                            {" "}
                            {/* Grid item, aligning right */}
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
