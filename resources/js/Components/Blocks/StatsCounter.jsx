import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { useLocale } from "@/Hooks/useLocale";
import { sanitizeHtml, safeBackgroundUrl } from "@/utils/sanitize";

const StatsCounter = ({ block }) => {
    const { currentLocale, isRTL, getTranslatedField: t } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};

    const stats = content.stats || [];
    const columns = config.columns || 3;
    const bgColor = config.background_color || "#2B3D2F";
    const textColor = config.text_color || "#ffffff";
    const accentColor = config.accent_color || "#C9A94E";
    const bgImage = safeBackgroundUrl(content.background_image_url);
    const overlayOpacity = config.overlay_opacity ?? 0.6;
    const bodyHtml = t(content.body) || "";

    const colSize = Math.max(1, Math.min(12, Math.floor(12 / columns)));

    return (
        <Box
            component="section"
            sx={{
                position: "relative",
                backgroundColor: bgColor,
                backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: textColor,
                py: config.padding_y === "xl" ? 10 : config.padding_y === "lg" ? 7 : 5,
                "&::before": bgImage
                    ? {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          backgroundColor: bgColor,
                          opacity: overlayOpacity,
                          zIndex: 0,
                      }
                    : undefined,
                "& > *": { position: "relative", zIndex: 1 },
            }}
        >
            <Container maxWidth="lg">
                {content.heading && (
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{
                            fontFamily: "'Amiri', serif",
                            color: accentColor,
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        {t(content.heading)}
                    </Typography>
                )}
                {content.subtitle && (
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{ mb: bodyHtml ? 3 : 6, opacity: 0.85 }}
                    >
                        {t(content.subtitle)}
                    </Typography>
                )}
                {bodyHtml && (
                    // sanitize() uses DOMPurify (isomorphic-dompurify) — safe HTML only.
                    <Box
                        sx={{
                            mb: 6,
                            mx: "auto",
                            maxWidth: 720,
                            opacity: 0.9,
                            textAlign: "center",
                            "& p": { mb: 1.5 },
                        }}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(bodyHtml) }}
                    />
                )}

                <Grid container spacing={4} justifyContent="center">
                    {stats.map((stat, idx) => (
                        <Grid size={{ xs: 12, sm: 6, md: colSize }} key={idx}>
                            <Box
                                sx={{
                                    textAlign: "center",
                                    borderRight: (!isRTL && idx < stats.length - 1) ? `1px solid ${accentColor}33` : "none",
                                    borderLeft:  (isRTL  && idx < stats.length - 1) ? `1px solid ${accentColor}33` : "none",
                                    px: 2,
                                }}
                            >
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 800,
                                        color: accentColor,
                                        lineHeight: 1.1,
                                        fontSize: { xs: "2.5rem", md: "3.5rem" },
                                        fontFamily: "'Tajawal', sans-serif",
                                    }}
                                >
                                    {stat.value || ""}
                                    {stat.suffix && (
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontSize: "1.2rem",
                                                ml: 0.5,
                                                color: textColor,
                                                opacity: 0.85,
                                            }}
                                        >
                                            {t(stat.suffix)}
                                        </Typography>
                                    )}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mt: 1,
                                        fontFamily: "'Tajawal', sans-serif",
                                        opacity: 0.9,
                                        fontWeight: 500,
                                    }}
                                >
                                    {t(stat.label)}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default StatsCounter;
