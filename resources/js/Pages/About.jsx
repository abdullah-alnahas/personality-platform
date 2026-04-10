// Create file: resources/js/Pages/About.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Box, Typography, Container, Paper } from '@mui/material';
import { useLocale } from '@/Hooks/useLocale';

export default function About({ aboutContent, siteName }) {
    const { getTranslatedField, currentLocale } = useLocale();

    const translatedContent = getTranslatedField(aboutContent, currentLocale);
    const pageTitle = `About - ${getTranslatedField(siteName, currentLocale) || 'Platform'}`;

    return (
        <>
            <Head title={pageTitle} />

            <Typography variant="h3" component="h1" gutterBottom>
                About Us {/* Consider making title dynamic via settings too */}
            </Typography>

            <Paper sx={{ p: { xs: 2, md: 4 } }}>
                {/* Render the content. Assumes basic text/paragraphs for now. */}
                {/* If HTML is stored, use dangerouslySetInnerHTML with sanitization */}
                <Box sx={{ '& p': { mb: 2 }, lineHeight: 1.7 }}>
                    {translatedContent ? (
                        translatedContent.split('\n').map((paragraph, index) => (
                            <Typography key={index} paragraph>
                                {paragraph}
                            </Typography>
                        ))
                    ) : (
                        <Typography>About content coming soon.</Typography>
                    )}
                </Box>
            </Paper>
        </>
    );
}

// Assign the PublicLayout
About.layout = page => <PublicLayout children={page} />;
