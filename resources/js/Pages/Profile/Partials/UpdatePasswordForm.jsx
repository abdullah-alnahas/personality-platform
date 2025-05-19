import React, { useRef } from "react"; // Removed useState as Transition is replaced
import { useForm } from "@inertiajs/react";
import {
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    Fade, // MUI's alternative for simple fade transitions
} from "@mui/material";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (formErrors) => {
                // Renamed errors to formErrors to avoid conflict with errors from useForm
                if (formErrors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus(); // Added optional chaining
                }

                if (formErrors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus(); // Added optional chaining
                }
            },
        });
    };

    return (
        <Box component="section" className={className} sx={{ maxWidth: "xl" }}>
            {" "}
            {/* Use sx for max-width if needed */}
            <header>
                <Typography variant="h6" component="h2" gutterBottom>
                    Update Password
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Ensure your account is using a long, random password to stay
                    secure.
                </Typography>
            </header>
            <form onSubmit={updatePassword}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="current_password"
                            name="current_password"
                            label="Current Password"
                            type="password"
                            inputRef={currentPasswordInput} // Use inputRef for MUI TextField
                            value={data.current_password}
                            onChange={(e) =>
                                setData("current_password", e.target.value)
                            }
                            autoComplete="current-password"
                            error={!!errors.current_password}
                            helperText={errors.current_password}
                            disabled={processing}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="New Password"
                            type="password"
                            inputRef={passwordInput} // Use inputRef for MUI TextField
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            autoComplete="new-password"
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={processing}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="password_confirmation"
                            name="password_confirmation"
                            label="Confirm New Password"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            autoComplete="new-password"
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
                            disabled={processing}
                        />
                    </Grid>

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

                        <Fade in={recentlySuccessful}>
                            <Typography
                                variant="body2"
                                sx={{ color: "success.main" }}
                            >
                                Saved.
                            </Typography>
                        </Fade>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
