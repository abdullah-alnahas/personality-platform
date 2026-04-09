import React from "react";
import { Box, Typography, Container } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { useLocale } from "@/Hooks/useLocale";

export default function FeaturedQuote({ block }) {
    const { getTranslatedField, currentLocale, isRTL } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};
    const resolvedData = block?.resolved_data || {};

    const quoteText =
        getTranslatedField(resolvedData.text, currentLocale) ||
        getTranslatedField(content.custom_text, currentLocale);
    const source =
        getTranslatedField(resolvedData.source, currentLocale) ||
        getTranslatedField(content.custom_source, currentLocale);

    const isDark = config.style === "dark";
    const bgColor = config.background_color || (isDark ? "#1a1a2e" : "#f8f6f3");
    const textColor = config.text_color || (isDark ? "#ffffff" : "text.primary");
    const accentColor = config.accent_color || "primary.main";

    if (!quoteText) return null;

    return (
        <Box
            sx={{
                bgcolor: bgColor,
                py: { xs: 6, md: 10 },
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    textAlign: "center",
                    position: "relative",
                }}
            >
                {/* Decorative opening quote */}
                <FormatQuoteIcon
                    sx={{
                        fontSize: { xs: 60, md: 80 },
                        color: accentColor,
                        opacity: 0.15,
                        transform: "rotate(180deg)",
                        display: "block",
                        mx: "auto",
                        mb: -2,
                    }}
                />

                <Typography
                    variant="h4"
                    component="blockquote"
                    sx={{
                        color: textColor,
                        fontFamily: isRTL ? "'Amiri', serif" : "'Georgia', 'Times New Roman', serif",
                        fontStyle: isRTL ? "normal" : "italic",
                        fontWeight: 400,
                        lineHeight: 1.8,
                        fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                        mb: 3,
                        px: { xs: 1, md: 4 },
                        direction: isRTL ? "rtl" : "ltr",
                    }}
                >
                    {isRTL ? `«${quoteText}»` : `\u201c${quoteText}\u201d`}
                </Typography>

                {/* Decorative closing quote */}
                <FormatQuoteIcon
                    sx={{
                        fontSize: { xs: 40, md: 50 },
                        color: accentColor,
                        opacity: 0.15,
                        display: "block",
                        mx: "auto",
                        mb: 3,
                    }}
                />

                {source && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 32,
                                height: 2,
                                bgcolor: accentColor,
                                opacity: 0.5,
                            }}
                        />
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: textColor,
                                opacity: 0.8,
                                fontWeight: 500,
                                letterSpacing: isRTL ? 0 : 0.5,
                                direction: isRTL ? "rtl" : "ltr",
                            }}
                        >
                            {source}
                        </Typography>
                        <Box
                            sx={{
                                width: 32,
                                height: 2,
                                bgcolor: accentColor,
                                opacity: 0.5,
                            }}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
}
