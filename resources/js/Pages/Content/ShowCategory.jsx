import React from "react";
import { Head, Link as InertiaLink, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Grid,
    Breadcrumbs,
    Link as MuiLink,
    Button,
    Pagination,
} from "@mui/material"; // Removed Container, Paper as layout handles it
import ContentCard from "@/Components/ContentCard";
import HomeIcon from "@mui/icons-material/Home";

const getTranslatedField = (fieldObject, pageProps, fallback = "") => {
    /* ... (same as before) ... */
    const currentLocale = pageProps.current_locale || "en";
    if (fieldObject == null) return fallback;
    if (typeof fieldObject !== "object") return String(fieldObject) || fallback;
    return (
        fieldObject[currentLocale] ||
        fieldObject[Object.keys(fieldObject)[0]] ||
        fallback
    );
};

export default function ShowCategory({ category, items }) {
    const { props: pageProps } = usePage();
    const { data: results, links, current_page, last_page } = items; // Renamed data to results for clarity
    const categoryName = getTranslatedField(category.name, pageProps);

    return (
        <>
            <Head
                title={categoryName}
                description={getTranslatedField(
                    category.description,
                    pageProps,
                )}
            />
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
            {category.description && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    {getTranslatedField(category.description, pageProps)}
                </Typography>
            )}

            <Grid container spacing={3}>
                {results && results.length > 0 ? (
                    results.map((item) => (
                        <Grid xs={12} sm={6} md={4} key={`cat-item-${item.id}`}>
                            {" "}
                            {/* Grid v2 */}
                            <ContentCard item={item} />
                        </Grid>
                    ))
                ) : (
                    <Grid xs={12}>
                        {" "}
                        {/* Grid v2 */}
                        <Typography>
                            No items found in this category.
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {links &&
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
ShowCategory.layout = (page) => {
    /* ... (same as before) ... */
    const categoryNameObject = page.props.category?.name;
    let titleForLayout = "Category";
    if (categoryNameObject && typeof categoryNameObject === "object") {
        const currentLocale = page.props.locale || "en";
        titleForLayout =
            categoryNameObject[currentLocale] ||
            Object.values(categoryNameObject)[0] ||
            "Category";
    } else if (categoryNameObject) {
        titleForLayout = String(categoryNameObject);
    }
    return <PublicLayout title={titleForLayout}>{page}</PublicLayout>; // Pass title to PublicLayout
};
