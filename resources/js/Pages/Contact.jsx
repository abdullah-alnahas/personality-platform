// Edit file: resources/js/Pages/Contact.jsx
import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Container,
    Paper,
    Grid,
    TextField,
    Button,
    Alert,
} from "@mui/material";

export default function Contact() {
    const { flash } = usePage().props;
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: "",
        email: "",
        message: "",
    });
    React.useEffect(() => {
        if (recentlySuccessful) {
            reset();
        }
    }, [recentlySuccessful, reset]);
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("contact.store"), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Contact Us" />
            <Typography variant="h3" component="h1" gutterBottom>
                {" "}
                Contact Us{" "}
            </Typography>
            <Paper sx={{ p: { xs: 2, md: 4 } }}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" gutterBottom>
                            Send us a message
                        </Typography>
                        {flash?.success && recentlySuccessful && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {flash.success}
                            </Alert>
                        )}
                        {flash?.error && !recentlySuccessful && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {flash.error}
                            </Alert>
                        )}
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Your Name"
                                name="name"
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
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
                                autoComplete="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={processing}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="message"
                                label="Your Message"
                                name="message"
                                multiline
                                rows={5}
                                value={data.message}
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                                error={!!errors.message}
                                helperText={errors.message}
                                disabled={processing}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={processing}
                            >
                                {processing ? "Sending..." : "Send Message"}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" gutterBottom>
                            Other ways to connect
                        </Typography>
                        <Typography paragraph color="text.secondary">
                            Find us on social media (links in the footer) or
                            reach out via the details below if provided.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}
Contact.layout = (page) => <PublicLayout children={page} />;
