import React from "react";
import { Head, Link as InertiaLink, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Chip,
    CardMedia,
    Paper,
    Breadcrumbs,
    Link as MuiLink, // Renamed to avoid conflict
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const getTranslatedField = (fieldObject, locale = "en", fallback = "") => {
    const { props } = usePage();
    const currentLocale = props.locale || locale;
    if (fieldObject == null) return fallback;
    if (typeof fieldObject !== "object" || fieldObject === null)
        return String(fieldObject) || fallback;
    return (
        fieldObject[currentLocale] ||
        fieldObject[locale] ||
        Object.values(fieldObject)[0] ||
        fallback
    );
};

// Helper to construct srcset string
const buildSrcSet = (sources) => {
    if (!sources || sources.length === 0) return "";
    return sources.map((source) => `${source.url} ${source.width}w`).join(", ");
};

export default function ShowItem({ item }) {
    const { props } = usePage();
    if (!item) return null;

    const title = getTranslatedField(item.title, props.locale);
    const content = getTranslatedField(item.content, props.locale); // Assuming content is plain text or sanitized HTML for dangerouslySetInnerHTML
    const categoryName = getTranslatedField(item.category_name, props.locale);
    const metaDescription =
        getTranslatedField(item.meta_fields, props.locale, "").description ||
        getTranslatedField(item.excerpt, props.locale);

    const imageDetails = item.image_details;
    let webpSrcSet = null;
    let jpgSrcSet = null;
    let fallbackImageSrc = imageDetails?.original_url; // Default fallback

    if (imageDetails) {
        webpSrcSet = buildSrcSet(imageDetails.webp_sources);
        jpgSrcSet = buildSrcSet(imageDetails.jpg_sources);
        // Determine a good fallback for the <img> src attribute
        if (imageDetails.jpg_sources && imageDetails.jpg_sources.length > 0) {
            // Use the largest JPG source or a medium one as fallback
            fallbackImageSrc =
                imageDetails.jpg_sources[imageDetails.jpg_sources.length - 1]
                    ?.url || imageDetails.original_url;
        } else if (
            imageDetails.webp_sources &&
            imageDetails.webp_sources.length > 0
        ) {
            fallbackImageSrc =
                imageDetails.webp_sources[imageDetails.webp_sources.length - 1]
                    ?.url || imageDetails.original_url;
        }
    }

    return (
        <>
            <Head title={title} description={metaDescription} />
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
                {item.category_slug && categoryName && (
                    <MuiLink
                        component={InertiaLink}
                        underline="hover"
                        color="inherit"
                        href={route(
                            "content.show-category",
                            item.category_slug,
                        )}
                    >
                        {categoryName}
                    </MuiLink>
                )}
                <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>

            <Paper sx={{ p: { xs: 2, md: 4 } }}>
                {imageDetails && fallbackImageSrc && (
                    <Box
                        sx={{
                            mb: 3,
                            maxHeight: { xs: 300, sm: 400, md: 500 }, // Responsive max height
                            overflow: "hidden",
                            borderRadius: 1,
                            width: "100%", // Ensure Box takes width for picture to fill
                        }}
                    >
                        <picture style={{ width: "100%", display: "block" }}>
                            {webpSrcSet && (
                                <source
                                    srcSet={webpSrcSet}
                                    type="image/webp"
                                    sizes="(max-width: 600px) 90vw, (max-width: 900px) 80vw, 1200px"
                                />
                            )}
                            {jpgSrcSet && (
                                <source
                                    srcSet={jpgSrcSet}
                                    type="image/jpeg"
                                    sizes="(max-width: 600px) 90vw, (max-width: 900px) 80vw, 1200px"
                                />
                            )}
                            <img
                                src={fallbackImageSrc}
                                alt={imageDetails.alt || title}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                    objectFit: "cover",
                                    maxHeight: "inherit",
                                }}
                                // The sizes attribute helps browser pick correct image from srcset
                                sizes="(max-width: 600px) 90vw, (max-width: 900px) 80vw, 1200px"
                            />
                        </picture>
                    </Box>
                )}

                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{ wordBreak: "break-word" }}
                >
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

                {/* For HTML content from RTE, ensure it's sanitized on backend */}
                <Box
                    sx={{
                        mt: 3,
                        "& p": { mb: 2 },
                        lineHeight: 1.7,
                        wordBreak: "break-word",
                        // Basic styling for HTML content
                        "& h1": { typography: "h3", mt: 3, mb: 1 },
                        "& h2": { typography: "h4", mt: 3, mb: 1 },
                        "& h3": { typography: "h5", mt: 2, mb: 1 },
                        "& h4": { typography: "h6", mt: 2, mb: 1 },
                        "& ul, & ol": { pl: 3 },
                        "& li": { mb: 0.5 },
                        "& a": {
                            color: "primary.main",
                            textDecoration: "underline",
                        },
                        "& img": {
                            maxWidth: "100%",
                            height: "auto",
                            my: 2,
                            borderRadius: 1,
                        },
                        "& blockquote": {
                            borderLeft: "4px solid",
                            borderColor: "divider",
                            pl: 2,
                            ml: 0,
                            my: 2,
                            fontStyle: "italic",
                        },
                        "& pre": {
                            backgroundColor: "grey.100",
                            p: 2,
                            my: 2,
                            overflowX: "auto",
                            borderRadius: 1,
                            fontFamily: "monospace",
                        },
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </Paper>
        </>
    );
}

ShowItem.layout = (page) => {
    const itemTitleObject = page.props.item?.title;
    let titleForLayout = "Content";
    if (itemTitleObject && typeof itemTitleObject === "object") {
        const currentLocale = page.props.locale || "en";
        titleForLayout =
            itemTitleObject[currentLocale] ||
            Object.values(itemTitleObject)[0] ||
            "Content";
    } else if (itemTitleObject) {
        titleForLayout = String(itemTitleObject);
    }
    return <PublicLayout children={page} title={titleForLayout} />;
};
