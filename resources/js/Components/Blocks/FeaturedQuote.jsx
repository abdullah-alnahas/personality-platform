import React from "react";
import { Box, Typography, Container } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { useLocale } from "@/Hooks/useLocale";

const POSITION_STYLES = {
    'top-center':   { top: 8,  start: '50%', transform: 'translateX(-50%) rotate(180deg)' },
    'top-start':    { top: 8,  start: 16,    transform: 'rotate(180deg)' },
    'top-end':      { top: 8,  end: 16,      transform: 'rotate(180deg)' },
    'middle-start': { top: '50%', start: 16, transform: 'translateY(-50%) rotate(180deg)' },
    'middle-end':   { top: '50%', end: 16,   transform: 'translateY(-50%) rotate(180deg)' },
    'hidden':       null,
};

function MarkPositioned({ color, opacity, position }) {
    const cfg = POSITION_STYLES[position] ?? POSITION_STYLES['top-center'];
    if (!cfg) return null;
    const sx = {
        position: 'absolute',
        fontSize: { xs: 60, md: 80 },
        color,
        opacity,
        zIndex: 0,
        top: cfg.top,
        transform: cfg.transform,
    };
    if (cfg.start !== undefined) sx.insetInlineStart = cfg.start;
    if (cfg.end   !== undefined) sx.insetInlineEnd   = cfg.end;
    return <FormatQuoteIcon sx={sx} aria-hidden="true" />;
}

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
    const bgImage = content.background_image_url;
    const overlayOpacity = config.overlay_opacity ?? 0.55;
    const quoteMarkPosition = config.quote_mark_position || 'top-center';
    const quoteMarkColor = config.quote_mark_color || accentColor;
    const markOpacity = config.quote_mark_opacity ?? 0.18;

    if (!quoteText) return null;

    return (
        <Box
            sx={{
                bgcolor: bgColor,
                backgroundImage: bgImage ? `linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url(${bgImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
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
                <MarkPositioned
                    color={quoteMarkColor}
                    opacity={markOpacity}
                    position={quoteMarkPosition}
                />

                <Typography
                    variant="h4"
                    component="blockquote"
                    sx={{
                        position: 'relative',
                        zIndex: 1,
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
                    {isRTL ? `«${quoteText}»` : `“${quoteText}”`}
                </Typography>

                {source && (
                    <Box
                        sx={{
                            position: 'relative',
                            zIndex: 1,
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
