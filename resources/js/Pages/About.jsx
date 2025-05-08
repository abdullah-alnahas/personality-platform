// Create file: resources/js/Pages/About.jsx
import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout'; // Import the public layout
import { Box, Typography, Container, Paper } from '@mui/material';

// Helper function to get translated field (copied for self-containment, consider extracting)
const getTranslatedField = (fieldObject, locale = 'en', fallback = '') => {
    const currentLocale = usePage().props.locale || locale;
    if (fieldObject == null) { return fallback; }
    if (typeof fieldObject !== 'object') { return String(fieldObject) || fallback; }
    return fieldObject[currentLocale] || fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};

export default function About({ aboutContent, siteName }) { // Destructure props

    // Get the translated content for the current locale
    const translatedContent = getTranslatedField(aboutContent);
    const pageTitle = `About - ${getTranslatedField(siteName) || 'Platform'}`;

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
