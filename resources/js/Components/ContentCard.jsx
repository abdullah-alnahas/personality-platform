// Create file: resources/js/Components/ContentCard.jsx
import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Link, Box, Chip } from '@mui/material';
import { Link as InertiaLink } from '@inertiajs/react';

// Helper to get translated field
const getTranslatedField = (fieldObject, locale = 'en', fallback = '') => {
    if (!fieldObject) return fallback;
    return fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};

export default function ContentCard({ item }) {
    if (!item) return null;

    const title = getTranslatedField(item.title);
    const excerpt = getTranslatedField(item.excerpt);
    const categoryName = getTranslatedField(item.category_name);

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardActionArea component={InertiaLink} href={route('content.show-item', item.slug)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {item.image_url && (
                    <CardMedia
                        component="img"
                        height="160" // Adjust height as needed
                        image={item.image_url} // Use thumbnail or original
                        alt={title}
                        sx={{ objectFit: 'cover' }}
                    />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ mb: 1 }}>
                        {title}
                    </Typography>
                     {categoryName && item.category_slug && (
                         <Chip label={categoryName} size="small" variant="outlined" sx={{ mb: 1 }} />
                     )}
                    <Typography variant="body2" color="text.secondary">
                        {excerpt || 'Read more...'} {/* Show excerpt or fallback */}
                    </Typography>
                </CardContent>
            </CardActionArea>
            {/* Optional: Add CardActions for date, author, etc. */}
             {/* <Box sx={{ p: 2, pt: 0 }}>
                 <Typography variant="caption" color="text.secondary">
                     {item.publish_date_formatted}
                 </Typography>
             </Box> */}
        </Card>
    );
}