import React from "react";
import { Head } from "@inertiajs/react";
import { Box, Typography, Container } from "@mui/material";
import PublicLayout from "@/Layouts/PublicLayout";
import BlockRenderer from "@/Components/Blocks/BlockRenderer";
import { useLocale } from "@/Hooks/useLocale";

export default function PageDisplay({ page, blocks, settings }) {
    const { getTranslatedField, currentLocale } = useLocale();

    const siteName = getTranslatedField(
        settings?.site_name?.value,
        currentLocale,
        "Personality Platform",
    );

    if (!page) {
        return (
            <>
                <Head title={`Page Not Found - ${siteName}`} />
                <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                        }}
                    >
                        Page Not Found
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        The page you are looking for does not exist or has been
                        removed.
                    </Typography>
                </Container>
            </>
        );
    }

    const pageTitle = getTranslatedField(page.title, currentLocale, "Page");
    const pageBlocks = blocks || page.blocks || [];

    return (
        <>
            <Head title={`${pageTitle} - ${siteName}`} />
            <Box
                sx={{
                    // Break out of PublicLayout Container for full-width blocks
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    right: '50%',
                    mx: '-50vw',
                    mt: { xs: -2, sm: -3, md: -4 },
                }}
            >
                {pageBlocks.map((block, index) => (
                    <BlockRenderer
                        key={block.id || `block-${index}`}
                        block={block}
                    />
                ))}
                {pageBlocks.length === 0 && (
                    <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                        >
                            This page has no content yet.
                        </Typography>
                    </Container>
                )}
            </Box>
        </>
    );
}

PageDisplay.layout = (page) => <PublicLayout>{page}</PublicLayout>;
