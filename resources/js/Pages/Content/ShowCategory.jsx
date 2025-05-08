// Create file: resources/js/Pages/Content/ShowCategory.jsx
import React from 'react';
import { Head, Link as InertiaLink } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout'; // Import the public layout
import { Box, Typography, Container, Grid, Paper, Breadcrumbs, Link, Button } from '@mui/material';
import ContentCard from '@/Components/ContentCard';
import HomeIcon from '@mui/icons-material/Home';


// Helper to get translated field
const getTranslatedField = (fieldObject, locale = 'en', fallback = '') => {
    if (!fieldObject) return fallback;
    return fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};

export default function ShowCategory({ category, items }) {
    const { data, links } = items; // Extract paginated data and links
    const categoryName = getTranslatedField(category.name);

    return (
        <>
            <Head title={categoryName} description={getTranslatedField(category.description)} />

             {/* Breadcrumbs */}
             <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                 <Link component={InertiaLink} underline="hover" sx={{ display: 'flex', alignItems: 'center' }} color="inherit" href={route('home')}>
                     <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Home
                 </Link>
                 <Typography color="text.primary">{categoryName}</Typography>
             </Breadcrumbs>

            <Typography variant="h4" component="h1" gutterBottom>
                {categoryName}
            </Typography>
            {category.description && (
                 <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                     {getTranslatedField(category.description)}
                 </Typography>
             )}

            <Grid container spacing={3}>
                {data.length > 0 ? (
                    data.map(item => (
                        <Grid item xs={12} sm={6} md={4} key={`cat-item-${item.id}`}>
                            <ContentCard item={item} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography>No items found in this category.</Typography>
                    </Grid>
                )}
            </Grid>

            {/* Inertia Pagination Links */}
            {links.length > 3 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {links.map((link, index) => (
                            <Button
                                key={index}
                                component={InertiaLink}
                                href={link.url}
                                disabled={!link.url}
                                size="small"
                                variant={link.active ? 'contained' : 'outlined'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll // Keep scroll position on pagination
                                preserveState // Keep component state on pagination
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </>
    );
}

// Assign the PublicLayout
ShowCategory.layout = page => <PublicLayout children={page} title={getTranslatedField(page.props.category?.name)} />;