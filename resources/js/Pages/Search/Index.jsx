// Edit file: resources/js/Pages/Search/Index.jsx
import React from "react";
import { Head, Link as InertiaLink, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Button,
    Pagination,
} from "@mui/material"; // MUI Pagination
import ContentCard from "@/Components/ContentCard";

const getTranslatedField = (fieldObject, locale = "en", fallback = "") => {
    const { props } = usePage();
    const currentLocale = props.locale || locale;
    if (fieldObject == null) {
        return fallback;
    }
    if (typeof fieldObject !== "object") {
        return String(fieldObject) || fallback;
    }
    return (
        fieldObject[currentLocale] ||
        fieldObject[locale] ||
        Object.values(fieldObject)[0] ||
        fallback
    );
};

export default function Index({ query, items }) {
    const { data: results, links, current_page, last_page, total } = items;
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
                            size={{ xs: 12, sm: 6, md: 4 }}
                            key={`search-item-${item.id}`}
                        >
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
            {results &&
                results.length > 0 &&
                links &&
                links.length > 3 && ( // Standard Inertia pagination links
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 4,
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {links.map((link, index) => (
                                <Button
                                    key={index}
                                    component={
                                        link.url ? InertiaLink : "button"
                                    }
                                    href={link.url}
                                    disabled={!link.url || link.active}
                                    size="small"
                                    variant={
                                        link.active ? "contained" : "outlined"
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
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
Index.layout = (page) => <PublicLayout children={page} />;
