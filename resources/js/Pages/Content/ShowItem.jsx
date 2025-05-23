import React from "react";
import { Head, Link as InertiaLink, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Chip,
    Paper,
    Breadcrumbs,
    Link as MuiLink,
} from "@mui/material";
import { styled } from "@mui/material/styles"; // Import styled utility
import HomeIcon from "@mui/icons-material/Home";

// Styled components for <picture> and <img>
const StyledPictureElement = styled("picture")({
    width: "100%",
    display: "block", // Ensure picture element behaves as a block for sizing
});

const StyledImgElement = styled("img")({
    width: "100%",
    height: "100%", // Make height 100% to fill the aspect ratio box
    display: "block",
    objectFit: "cover", // Ensures image covers the area, maintains aspect ratio
    position: "absolute", // Positioned within the relative parent Box
    top: 0,
    left: 0,
});

// getTranslatedField and buildSrcSet helpers remain the same
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

const buildSrcSet = (sources) => {
    if (!sources || !Array.isArray(sources) || sources.length === 0) return "";
    return sources.map((source) => `${source.url} ${source.width}w`).join(", ");
};

export default function ShowItem({ item }) {
    const { props: pageProps } = usePage();
    if (!item) return null;

    const title = getTranslatedField(item.title, pageProps.locale);
    const content = getTranslatedField(item.content, pageProps.locale);
    const categoryName = getTranslatedField(
        item.category_name,
        pageProps.locale,
    );
    const metaDescription =
        getTranslatedField(item.meta_fields, pageProps.locale, "")
            .description || getTranslatedField(item.excerpt, pageProps.locale);

    const imageDetails = item.image_details;
    let webpSrcSet = null;
    let jpgSrcSet = null;
    let fallbackImageSrc = imageDetails?.original_url;

    if (imageDetails) {
        webpSrcSet = buildSrcSet(imageDetails.webp_sources);
        jpgSrcSet = buildSrcSet(imageDetails.jpg_sources);
        if (imageDetails.jpg_sources && imageDetails.jpg_sources.length > 0) {
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

    const aspectRatioPaddingTop = "75%"; // For 4:3 ratio

    return (
        <>
            <Head title={title} description={metaDescription} />
            {/* Breadcrumbs remain the same */}
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
                            borderRadius: 1,
                            overflow: "hidden",
                            width: "100%",
                            position: "relative",
                            paddingTop: aspectRatioPaddingTop,
                        }}
                    >
                        <StyledPictureElement>
                            {" "}
                            {/* Use styled component */}
                            {webpSrcSet && (
                                <source
                                    srcSet={webpSrcSet}
                                    type="image/webp"
                                    sizes="(max-width: 600px) 90vw, (max-width: 960px) 80vw, 1200px"
                                />
                            )}
                            {jpgSrcSet && (
                                <source
                                    srcSet={jpgSrcSet}
                                    type="image/jpeg"
                                    sizes="(max-width: 600px) 90vw, (max-width: 960px) 80vw, 1200px"
                                />
                            )}
                            <StyledImgElement // Use styled component for img
                                src={fallbackImageSrc}
                                alt={imageDetails.alt || title}
                                sizes="(max-width: 600px) 90vw, (max-width: 960px) 80vw, 1200px"
                            />
                        </StyledPictureElement>
                    </Box>
                )}

                {/* Rest of the component (Typography for title, metadata, content Box) remains the same */}
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
                <Box
                    sx={{
                        mt: 3,
                        "& p": { mb: 2 },
                        lineHeight: 1.7,
                        wordBreak: "break-word",
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
    // page.props will contain pageProps needed by getTranslatedField
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
