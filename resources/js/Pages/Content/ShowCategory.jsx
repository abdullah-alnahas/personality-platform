// Edit file: resources/js/Pages/Content/ShowCategory.jsx
import React from "react";
import { Head, Link as InertiaLink, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Breadcrumbs,
    Link,
    Button,
    Pagination,
} from "@mui/material"; // Pagination is MUI, not Inertia's component
import ContentCard from "@/Components/ContentCard";
import HomeIcon from "@mui/icons-material/Home";

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

export default function ShowCategory({ category, items }) {
    const { data, links, current_page, last_page } = items; // last_page is for MUI Pagination
    const categoryName = getTranslatedField(category.name);

    return (
        <>
            <Head
                title={categoryName}
                description={getTranslatedField(category.description)}
            />
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link
                    component={InertiaLink}
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center" }}
                    color="inherit"
                    href={route("home")}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> Home
                </Link>
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
                    {getTranslatedField(category.description)}
                </Typography>
            )}
            <Grid container spacing={3}>
                {data.length > 0 ? (
                    data.map((item) => (
                        <Grid
                            size={{ xs: 12, sm: 6, md: 4 }}
                            key={`cat-item-${item.id}`}
                        >
                            <ContentCard item={item} />
                        </Grid>
                    ))
                ) : (
                    <Grid size={{ xs: 12 }}>
                        <Typography>
                            No items found in this category.
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {links.length > 3 && ( // Standard Inertia pagination links
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {links.map((link, index) => (
                            <Button
                                key={index}
                                component={link.url ? InertiaLink : "button"} // Use button if URL is null
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
ShowCategory.layout = (page) => (
    <PublicLayout
        children={page}
        title={getTranslatedField(page.props.category?.name)}
    />
);
