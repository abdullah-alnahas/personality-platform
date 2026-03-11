import React from "react";
import { Box, Container } from "@mui/material";
import { useLocale } from "@/Hooks/useLocale";

/**
 * Renders sanitized HTML body content from the page builder.
 * NOTE: All HTML content is sanitized server-side before storage.
 * Uses dangerouslySetInnerHTML intentionally for pre-sanitized rich text.
 */
export default function RichTextBlock({ block }) {
    const { getTranslatedField, currentLocale } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};

    const body = getTranslatedField(content.body, currentLocale);
    const rawMaxWidth = config.max_width || 800;
    const maxWidth = typeof rawMaxWidth === 'string' ? rawMaxWidth.replace('px', '') : rawMaxWidth;

    if (!body) return null;

    return (
        <Container
            maxWidth={false}
            sx={{
                maxWidth: `${maxWidth}px`,
                mx: "auto",
                px: { xs: 2, md: 4 },
                py: { xs: 3, md: 5 },
            }}
        >
            <Box
                sx={{
                    "& h1, & h2, & h3, & h4, & h5, & h6": {
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                        color: "text.primary",
                        mb: 2,
                        mt: 3,
                        lineHeight: 1.3,
                    },
                    "& p": {
                        fontSize: "1.05rem",
                        lineHeight: 1.85,
                        color: "text.secondary",
                        mb: 2,
                    },
                    "& a": {
                        color: "primary.main",
                        textDecoration: "underline",
                        "&:hover": {
                            textDecoration: "none",
                        },
                    },
                    "& ul, & ol": {
                        pl: 3,
                        mb: 2,
                        "& li": {
                            mb: 0.5,
                            lineHeight: 1.75,
                            color: "text.secondary",
                        },
                    },
                    "& blockquote": {
                        borderLeft: 4,
                        borderColor: "primary.main",
                        pl: 3,
                        py: 1,
                        my: 3,
                        mx: 0,
                        fontStyle: "italic",
                        color: "text.secondary",
                        bgcolor: "grey.50",
                        borderRadius: "0 8px 8px 0",
                    },
                    "& img": {
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: 2,
                    },
                }}
                dangerouslySetInnerHTML={{ __html: body }}
            />
        </Container>
    );
}
