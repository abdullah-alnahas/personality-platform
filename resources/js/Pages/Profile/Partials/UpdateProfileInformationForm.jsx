import React from "react";
import { Link as InertiaLink, useForm, usePage } from "@inertiajs/react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    Alert,
    Link as MuiLink, // For the verification link
} from "@mui/material";

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <Box component="section" className={className} sx={{ maxWidth: "xl" }}>
            {" "}
            {/* Use sx for max-width if needed, or let parent Grid control it */}
            <header>
                <Typography variant="h6" component="h2" gutterBottom>
                    Profile Information
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Update your account's profile information and email address.
                </Typography>
            </header>
            <form onSubmit={submit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            autoFocus
                            autoComplete="name"
                            error={!!errors.name}
                            helperText={errors.name}
                            disabled={processing}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            autoComplete="username"
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={processing}
                        />
                    </Grid>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Your email address is unverified.
                                <MuiLink
                                    component={InertiaLink}
                                    href={route("verification.send")}
                                    method="post"
                                    as="button"
                                    underline="hover"
                                    sx={{
                                        ml: 0.5,
                                        color: "primary.main",
                                        cursor: "pointer",
                                        border: "none",
                                        background: "none",
                                        padding: 0,
                                        font: "inherit",
                                    }}
                                >
                                    Click here to re-send the verification
                                    email.
                                </MuiLink>
                            </Typography>

                            {status === "verification-link-sent" && (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    A new verification link has been sent to
                                    your email address.
                                </Alert>
                            )}
                        </Grid>
                    )}

                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                        >
                            Save
                        </Button>

                        {recentlySuccessful && (
                            <Typography
                                variant="body2"
                                sx={{ color: "success.main" }}
                            >
                                Saved.
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
