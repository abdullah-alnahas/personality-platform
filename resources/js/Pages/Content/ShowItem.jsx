// Create file: resources/js/Pages/Content/ShowItem.jsx
import React from 'react';
import { Head, Link as InertiaLink } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout'; // Import the public layout
import { Box, Typography, Container, Chip, CardMedia, Paper, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

// Helper to get translated field
const getTranslatedField = (fieldObject, locale = 'en', fallback = '') => {
    if (!fieldObject) return fallback;
    return fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};

export default function ShowItem({ item }) {
    if (!item) return null; // Should be handled by 404, but good practice

    const title = getTranslatedField(item.title);
    const content = getTranslatedField(item.content); // Render as text for now
    const categoryName = getTranslatedField(item.category_name);

    return (
        <>
            <Head title={title} description={getTranslatedField(item.meta_fields, 'en', '').description /* Add meta description */} />

             {/* Breadcrumbs */}
             <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                 <Link component={InertiaLink} underline="hover" sx={{ display: 'flex', alignItems: 'center' }} color="inherit" href={route('home')}>
                     <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Home
                 </Link>
                 {item.category_slug && categoryName && (
                     <Link component={InertiaLink} underline="hover" color="inherit" href={route('content.show-category', item.category_slug)} >
                         {categoryName}
                     </Link>
                 )}
                 <Typography color="text.primary">{title}</Typography>
             </Breadcrumbs>


             <Paper sx={{ p: { xs: 2, md: 4 } }}>
                 {/* Featured Image */}
                 {item.featured_image_url && (
                     <Box sx={{ mb: 3, maxHeight: 400, overflow: 'hidden', borderRadius: 1 }}>
                          <CardMedia component="img" image={item.featured_image_url} alt={title} sx={{ width: '100%', height: 'auto' }} />
                     </Box>
                 )}

                 {/* Title */}
                 <Typography variant="h3" component="h1" gutterBottom>
                     {title}
                 </Typography>

                 {/* Meta Info */}
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, color: 'text.secondary', flexWrap: 'wrap' }}>
                     {item.category_slug && categoryName && (
                         <Chip label={categoryName} size="small" component={InertiaLink} href={route('content.show-category', item.category_slug)} clickable />
                     )}
                     {item.author_name && (
                         <Typography variant="body2">By {item.author_name}</Typography>
                     )}
                     {item.publish_date_formatted && (
                         <Typography variant="body2">Published on {item.publish_date_formatted}</Typography>
                     )}
                 </Box>

                 {/* Content (Rendered as plain text paragraphs for now) */}
                 <Box sx={{ mt: 3, '& p': { mb: 2 }, lineHeight: 1.7 }}>
                      {content.split('\n').map((paragraph, index) => (
                          <Typography key={index} paragraph>{paragraph}</Typography>
                      ))}
                      {/* TODO: Replace with safe HTML rendering if content includes HTML */}
                      {/* <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} /> */}
                 </Box>
             </Paper>
        </>
    );
}

// Assign the PublicLayout
ShowItem.layout = page => <PublicLayout children={page} title={getTranslatedField(page.props.item?.title)} />;