import React from "react";
import { Head, Link as InertiaLink, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Box, Typography, Grid, Button } from "@mui/material"; // Removed Container, Paper
import ContentCard from "@/Components/ContentCard";

// getTranslatedField can be removed if not used directly here (it's in ContentCard)

export default function Index({ query, items }) {
    const { data: results, links, total } = items; // Destructure directly
    const pageTitle = query ? `Search Results for "${query}"` : "Search";

    return (
        <>
            <Head title={pageTitle} />
            <Typography variant="h4" component="h1" gutterBottom>
                {query ? `Search Results for: "${query}"` : "Search"}
            </Typography>
            {query && total > 0 && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    Found {total} result(s).
                </Typography>
            )}
            {results && results.length > 0 ? (
                <Grid container spacing={3}>
                    {results.map((item) => (
                        <Grid
                            xs={12}
                            sm={6}
                            md={4}
                            key={`search-item-${item.id}`}
                        >
                            {" "}
                            {/* Grid v2 */}
                            <ContentCard item={item} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                query && (
                    <Typography sx={{ mt: 3 }}>
                        No results found for your query.
                    </Typography>
                )
            )}
            {results && results.length > 0 && links && links.length > 3 && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {links.map((link, index) => (
                            <Button
                                key={index}
                                component={link.url ? InertiaLink : "button"}
                                href={link.url}
                                disabled={!link.url || link.active}
                                size="small"
                                variant={link.active ? "contained" : "outlined"}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                                preserveState
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </>
    );
}
Index.layout = (page) => <PublicLayout>{page}</PublicLayout>; // Pass title to PublicLayout
