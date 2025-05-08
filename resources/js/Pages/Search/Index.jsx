import React from 'react';
import { Head, Link as InertiaLink, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Box, Typography, Container, Grid, Paper, Button, Pagination } from '@mui/material';
import ContentCard from '@/Components/ContentCard'; // Re-use the ContentCard

// Helper to get translated field
const getTranslatedField = (fieldObject, locale = 'en', fallback = '') => {
    const { props } = usePage(); // Access props directly for locale
    const currentLocale = props.locale || locale;
    if (fieldObject == null) { return fallback; }
    if (typeof fieldObject !== 'object') { return String(fieldObject) || fallback; }
    return fieldObject[currentLocale] || fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};


export default function Index({ query, items }) { // items is a Paginator instance
    const { data: results, links, current_page, last_page, total } = items;
    const pageTitle = query ? `Search Results for "${query}"` : "Search";

    return (
        <>
            <Head title={pageTitle} />

            <Typography variant="h4" component="h1" gutterBottom>
                {query ? `Search Results for: "${query}"` : 'Search'}
            </Typography>

            {query && total > 0 && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    Found {total} result(s).
                </Typography>
            )}


            {results && results.length > 0 ? (
                <Grid container spacing={3}>
                    {results.map(item => (
                        <Grid item xs={12} sm={6} md={4} key={`search-item-${item.id}`}>
                            <ContentCard item={item} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                query && <Typography sx={{ mt: 3 }}>No results found for your query.</Typography>
            )}

            {/* MUI Pagination for Laravel Paginator */}
            {results && results.length > 0 && links && links.length > 3 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <Pagination
                        count={last_page}
                        page={current_page}
                        onChange={(event, value) => {
                            // Find the link for the target page and visit it
                            const targetLink = links.find(link => link.label == value.toString() || (link.label.includes('Next') && value > current_page) || (link.label.includes('Previous') && value < current_page));
                            if (targetLink && targetLink.url) {
                                InertiaLink.visit(targetLink.url, { preserveState: true, preserveScroll: true });
                            }
                        }}
                        renderItem={(item) => {
                            // Find the corresponding link from Laravel Paginator for URL
                            const inertiaLink = links.find(link =>
                                (item.type === 'page' && link.label == item.page.toString()) ||
                                (item.type === 'previous' && link.label.includes('Previous')) ||
                                (item.type === 'next' && link.label.includes('Next'))
                            );
                            return (
                                <Button
                                    component={inertiaLink?.url ? InertiaLink : 'button'}
                                    href={inertiaLink?.url}
                                    disabled={!inertiaLink?.url || item.disabled}
                                    {...item} // Spread item props for type, selected, etc.
                                    sx={{
                                        fontWeight: item.selected ? 'bold' : 'normal',
                                        // Add other styling as needed
                                    }}
                                >
                                    {/* Use item.page for page numbers, or specific icons/text for prev/next */}
                                    {item.type === 'previous' ? 'Previous' : item.type === 'next' ? 'Next' : item.page}
                                </Button>
                            );
                        }}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </>
    );
}

// Assign the PublicLayout
Index.layout = page => <PublicLayout children={page} />;
