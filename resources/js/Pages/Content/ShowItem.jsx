import React from "react";
import { Head, Link as InertiaLink, usePage } from "@inertiajs/react"; // usePage is fine inside the component itself
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Container,
    Chip,
    CardMedia,
    Paper,
    Breadcrumbs,
    Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

// getTranslatedField is still used within the ShowItem component body correctly
const getTranslatedField = (fieldObject, locale = "en", fallback = "") => {
    const { props } = usePage();
    const currentLocale = props.locale || locale;
    if (!fieldObject) return fallback;
    if (typeof fieldObject !== "object" || fieldObject === null)
        return String(fieldObject) || fallback; // Ensure null check for safety
    return (
        fieldObject[currentLocale] ||
        fieldObject[locale] ||
        Object.values(fieldObject)[0] ||
        fallback
    );
};

export default function ShowItem({ item }) {
    if (!item) return null;

    const title = getTranslatedField(item.title); // Fine here
    const content = getTranslatedField(item.content);
    const categoryName = getTranslatedField(item.category_name);
    const metaDescription =
        getTranslatedField(item.meta_fields, usePage().props.locale || "en", "")
            .description || getTranslatedField(item.excerpt);

    return (
        <>
            <Head title={title} description={metaDescription} />
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
                {item.category_slug && categoryName && (
                    <Link
                        component={InertiaLink}
                        underline="hover"
                        color="inherit"
                        href={route(
                            "content.show-category",
                            item.category_slug,
                        )}
                    >
                        {categoryName}
                    </Link>
                )}
                <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>
            <Paper sx={{ p: { xs: 2, md: 4 } }}>
                {item.featured_image_url && (
                    <Box
                        sx={{
                            mb: 3,
                            maxHeight: 400,
                            overflow: "hidden",
                            borderRadius: 1,
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={item.featured_image_url}
                            alt={title}
                            sx={{ width: "100%", height: "auto" }}
                        />
                    </Box>
                )}
                <Typography variant="h3" component="h1" gutterBottom>
                    {title}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                        color: "text.secondary",
                        flexWrap: "wrap",
                    }}
                >
                    {item.category_slug && categoryName && (
                        <Chip
                            label={categoryName}
                            size="small"
                            component={InertiaLink}
                            href={route(
                                "content.show-category",
                                item.category_slug,
                            )}
                            clickable
                        />
                    )}
                    {item.author_name && (
                        <Typography variant="body2">
                            By {item.author_name}
                        </Typography>
                    )}
                    {item.publish_date_formatted && (
                        <Typography variant="body2">
                            Published on {item.publish_date_formatted}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ mt: 3, "& p": { mb: 2 }, lineHeight: 1.7 }}>
                    {content.split("\n").map((paragraph, index) => (
                        <Typography key={index} paragraph>
                            {paragraph}
                        </Typography>
                    ))}
                </Box>
            </Paper>
        </>
    );
}

// Corrected Layout Assignment:
ShowItem.layout = (page) => {
    // Safely derive title from page.props for the layout
    const itemTitleObject = page.props.item?.title;
    let titleForLayout = "Content"; // Default title
    if (itemTitleObject && typeof itemTitleObject === "object") {
        const currentLocale = page.props.locale || "en"; // Get locale from page.props
        titleForLayout =
            itemTitleObject[currentLocale] ||
            Object.values(itemTitleObject)[0] ||
            "Content";
    } else if (itemTitleObject) {
        titleForLayout = String(itemTitleObject);
    }
    return <PublicLayout children={page} title={titleForLayout} />;
};
