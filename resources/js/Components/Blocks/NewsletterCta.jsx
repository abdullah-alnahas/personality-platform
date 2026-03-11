import React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Container,
} from "@mui/material";
import { useForm } from "@inertiajs/react";
import { useLocale } from "@/Hooks/useLocale";

export default function NewsletterCta({ block }) {
    const { getTranslatedField, currentLocale } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};

    const heading = getTranslatedField(content.heading, currentLocale);
    const subtitle = getTranslatedField(content.subtitle, currentLocale);
    const buttonText = getTranslatedField(
        content.button_text,
        currentLocale,
        "Subscribe",
    );

    const bgColor = config.background_color || "primary.main";
    const textColor = config.text_color || "#ffffff";

    const { data, setData, post, processing, errors, reset, recentlySuccessful } =
        useForm({ email: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("subscribe"), {
            preserveScroll: true,
            onSuccess: () => reset("email"),
        });
    };

    return (
        <Box
            sx={{
                bgcolor: bgColor,
                py: { xs: 6, md: 8 },
            }}
        >
            <Container maxWidth="sm" sx={{ textAlign: "center" }}>
                {heading && (
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            color: textColor,
                            fontWeight: 700,
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            mb: 1,
                        }}
                    >
                        {heading}
                    </Typography>
                )}
                {subtitle && (
                    <Typography
                        variant="body1"
                        sx={{
                            color: textColor,
                            opacity: 0.9,
                            mb: 4,
                            lineHeight: 1.7,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <TextField
                        type="email"
                        placeholder="Enter your email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        size="medium"
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={processing}
                        sx={{
                            flexGrow: 1,
                            maxWidth: { sm: 340 },
                            bgcolor: "rgba(255,255,255,0.95)",
                            borderRadius: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "& fieldset": {
                                    borderColor: "transparent",
                                },
                                "&:hover fieldset": {
                                    borderColor: "rgba(0,0,0,0.1)",
                                },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={processing}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            bgcolor: "rgba(255,255,255,0.2)",
                            color: textColor,
                            border: "1px solid",
                            borderColor: "rgba(255,255,255,0.4)",
                            "&:hover": {
                                bgcolor: "rgba(255,255,255,0.3)",
                            },
                            minWidth: { xs: "100%", sm: "auto" },
                        }}
                    >
                        {processing ? "Subscribing..." : buttonText}
                    </Button>
                </Box>
                {recentlySuccessful && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: textColor,
                            mt: 2,
                            fontWeight: 500,
                        }}
                    >
                        Thank you for subscribing!
                    </Typography>
                )}
            </Container>
        </Box>
    );
}
