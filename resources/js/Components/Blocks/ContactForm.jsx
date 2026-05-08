import React from "react";
import { Box, Container, Typography, TextField, Button, Stack } from "@mui/material";
import { useForm, usePage } from "@inertiajs/react";
import { useLocale } from "@/Hooks/useLocale";

export default function ContactForm({ block }) {
    const { getTranslatedField, currentLocale, isRTL } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};
    const honeypotField = usePage().props.honeypotField || "_confirm_email";

    const heading = getTranslatedField(content.heading, currentLocale);
    const subtitle = getTranslatedField(content.subtitle, currentLocale);
    const nameLabel = getTranslatedField(content.name_label, currentLocale) ||
        (currentLocale === "ar" ? "الاسم" : currentLocale === "tr" ? "İsim" : "Name");
    const emailLabel = getTranslatedField(content.email_label, currentLocale) ||
        (currentLocale === "ar" ? "البريد الإلكتروني" : currentLocale === "tr" ? "E-posta" : "Email");
    const messageLabel = getTranslatedField(content.message_label, currentLocale) ||
        (currentLocale === "ar" ? "الرسالة" : currentLocale === "tr" ? "Mesaj" : "Message");
    const submitText = getTranslatedField(content.submit_text, currentLocale) ||
        (currentLocale === "ar" ? "إرسال" : currentLocale === "tr" ? "Gönder" : "Send");

    const bgColor = config.background_color || "#1E2A22";
    const textColor = config.text_color || "#ffffff";
    const accentColor = config.accent_color || "#C9F050";
    const bgImage = content.background_image_url;
    const overlayOpacity = config.overlay_opacity ?? 0.6;

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: "",
        email: "",
        message: "",
        [honeypotField]: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("contact.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Box
            component="section"
            sx={{
                bgcolor: bgColor,
                color: textColor,
                backgroundImage: bgImage
                    ? `linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url(${bgImage})`
                    : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                py: { xs: 6, md: config.padding_y === "xl" ? 10 : 8 },
            }}
        >
            <Container maxWidth="sm">
                {heading && (
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{
                            fontFamily: "'Amiri', serif",
                            fontWeight: 700,
                            mb: 1,
                            color: textColor,
                            direction: isRTL ? "rtl" : "ltr",
                        }}
                    >
                        {heading}
                    </Typography>
                )}
                {subtitle && (
                    <Typography
                        align="center"
                        sx={{ opacity: 0.85, mb: 4, color: textColor }}
                    >
                        {subtitle}
                    </Typography>
                )}

                <Box component="form" onSubmit={submit} noValidate>
                    {/* honeypot */}
                    <Box
                        component="input"
                        type="text"
                        name={honeypotField}
                        value={data[honeypotField]}
                        onChange={(e) => setData(honeypotField, e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        sx={{
                            position: "absolute",
                            left: "-9999px",
                            top: "-9999px",
                            width: "1px",
                            height: "1px",
                            opacity: 0,
                            overflow: "hidden",
                            pointerEvents: "none",
                        }}
                    />
                    <Stack spacing={2}>
                        <TextField
                            label={nameLabel}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                            fullWidth
                            variant="outlined"
                            sx={{
                                bgcolor: "rgba(255,255,255,0.08)",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    color: textColor,
                                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                    "&:hover fieldset": { borderColor: accentColor },
                                    "&.Mui-focused fieldset": { borderColor: accentColor },
                                },
                                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                                "& .MuiInputLabel-root.Mui-focused": { color: accentColor },
                            }}
                        />
                        <TextField
                            label={emailLabel}
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            required
                            fullWidth
                            variant="outlined"
                            sx={{
                                bgcolor: "rgba(255,255,255,0.08)",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    color: textColor,
                                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                    "&:hover fieldset": { borderColor: accentColor },
                                    "&.Mui-focused fieldset": { borderColor: accentColor },
                                },
                                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                                "& .MuiInputLabel-root.Mui-focused": { color: accentColor },
                            }}
                        />
                        <TextField
                            label={messageLabel}
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            error={!!errors.message}
                            helperText={errors.message}
                            required
                            fullWidth
                            multiline
                            rows={5}
                            variant="outlined"
                            sx={{
                                bgcolor: "rgba(255,255,255,0.08)",
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    color: textColor,
                                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                    "&:hover fieldset": { borderColor: accentColor },
                                    "&.Mui-focused fieldset": { borderColor: accentColor },
                                },
                                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                                "& .MuiInputLabel-root.Mui-focused": { color: accentColor },
                            }}
                        />
                        <Button
                            type="submit"
                            disabled={processing}
                            variant="contained"
                            sx={{
                                alignSelf: isRTL ? "flex-end" : "flex-start",
                                bgcolor: accentColor,
                                color: "#1E2A22",
                                fontWeight: 700,
                                px: 4,
                                py: 1.25,
                                borderRadius: 999,
                                boxShadow: "none",
                                "&:hover": { bgcolor: "#B8DC44", boxShadow: "none" },
                            }}
                        >
                            {submitText}
                        </Button>
                        {recentlySuccessful && (
                            <Typography
                                role="status"
                                sx={{ color: accentColor, mt: 1 }}
                            >
                                {currentLocale === "ar"
                                    ? "تم إرسال رسالتك. جزاك الله خيرا."
                                    : currentLocale === "tr"
                                    ? "Mesajınız gönderildi. Allah razı olsun."
                                    : "Your message has been sent. Thank you!"}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
