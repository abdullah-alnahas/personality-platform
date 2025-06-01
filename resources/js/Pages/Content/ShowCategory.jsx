import React from "react";
import { Head, Link as InertiaLink } from "@inertiajs/react"; // Removed usePage
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Grid,
    Breadcrumbs,
    Link as MuiLink,
    Button,
    Pagination,
} from "@mui/material";
import ContentCard from "@/Components/ContentCard";
import HomeIcon from "@mui/icons-material/Home";
import { useLocale } from "@/Hooks/useLocale"; // Import the hook

export default function ShowCategory({ category, items }) {
    const { getTranslatedField, currentLocale } = useLocale(); // Use the hook
    const { data: results, links, current_page, last_page, total } = items;
    const categoryName = getTranslatedField(category.name, currentLocale);
    const categoryDescription = getTranslatedField(
        category.description,
        currentLocale,
    );

    return (
        <>
            <Head title={categoryName} description={categoryDescription} />
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <MuiLink
                    component={InertiaLink}
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center" }}
                    color="inherit"
                    href={route("home")}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Home
                </MuiLink>
                <Typography color="text.primary">{categoryName}</Typography>
            </Breadcrumbs>
            <Typography variant="h4" component="h1" gutterBottom>
                {categoryName}
            </Typography>
            {categoryDescription && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    {categoryDescription}
                </Typography>
            )}
            <Grid container spacing={3}>
                {results && results.length > 0 ? (
                    results.map((item) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={`cat-item-${item.id}`}
                        >
                            <ContentCard item={item} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography>
                            No items found in this category.
                        </Typography>
                    </Grid>
                )}
            </Grid>
            {total > 0 && last_page > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <Pagination
                        count={last_page}
                        page={current_page}
                        onChange={(event, page) => {
                            router.get(
                                route("content.show-category", category.slug, {
                                    page,
                                    lang: currentLocale,
                                }),
                                {},
                                { preserveState: true, preserveScroll: true },
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
ShowCategory.layout = (page) => {
    const { getTranslatedField, currentLocale } = useLocale(); // Use hook inside layout determination
    const categoryNameObject = page.props.category?.name;
    const titleForLayout = getTranslatedField(
        categoryNameObject,
        currentLocale,
        "Category",
    );
    return <PublicLayout title={titleForLayout}>{page}</PublicLayout>;
};
