import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    TextField,
    Typography,
    Alert // For displaying general errors
} from '@mui/material';
import Link from '@mui/material/Link';
// import { Link } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        // Reset password field on component unmount or error clear
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login')); // Use the named route
    };

    return (
        <Container component="main" maxWidth="xs">
             <Head title="Admin Log in" />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Admin Sign in
                </Typography>

                {status && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{status}</Alert>}
                {/* Display general authentication error if exists */}
                {errors.email && !errors.password && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{errors.email}</Alert>}


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
                        onChange={(e) => setData('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
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
                        onChange={(e) => setData('password', e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={processing}
                    >
                        Sign In
                    </Button>
                    {/* Add Forgot Password link if needed */}
                    {canResetPassword && (
                         <Link href={route('password.request')} variant="body2">
                            Forgot your password?
                         </Link>
                     )}
                </Box>
            </Box>
        </Container>
    );
}
