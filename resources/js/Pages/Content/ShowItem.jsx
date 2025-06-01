import React from "react";
import { Head, Link as InertiaLink } from "@inertiajs/react"; // Removed usePage
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Chip,
    Paper,
    Breadcrumbs,
    Link as MuiLink,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import { useLocale } from "@/Hooks/useLocale"; // Import the hook

const StyledPictureElement = styled("picture")({
    width: "100%",
    display: "block",
});
const StyledImgElement = styled("img")({
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
});

const buildSrcSet = (sources) => {
    if (!sources || !Array.isArray(sources) || sources.length === 0) return "";
    return sources.map((source) => `${source.url} ${source.width}w`).join(", ");
};

export default function ShowItem({ item }) {
    const { getTranslatedField, currentLocale } = useLocale(); // Use the hook

    if (!item) return null;

    const title = getTranslatedField(item.title, currentLocale);
    const content = getTranslatedField(item.content, currentLocale);
    const categoryName = getTranslatedField(item.category_name, currentLocale);

    // Enhanced meta description logic
    let metaDescription = "";
    const itemMetaFields = item.meta_fields; // This is an object with locale keys
    if (
        itemMetaFields &&
        typeof itemMetaFields === "object" &&
        itemMetaFields[currentLocale]?.description
    ) {
        metaDescription = itemMetaFields[currentLocale].description;
    } else if (
        itemMetaFields &&
        typeof itemMetaFields === "object" &&
        Object.values(itemMetaFields)[0]?.description
    ) {
        // Fallback to first available meta description
        metaDescription = Object.values(itemMetaFields)[0].description;
    }
    if (!metaDescription) {
        // If no meta description, use excerpt
        metaDescription = getTranslatedField(item.excerpt, currentLocale);
    }

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
    const aspectRatioPaddingTop = "75%"; // 4:3

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
                            borderRadius: 1,
                            overflow: "hidden",
                            width: "100%",
                            position: "relative",
                            paddingTop: aspectRatioPaddingTop,
                        }}
                    >
                        <StyledPictureElement>
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
                            <StyledImgElement
                                src={fallbackImageSrc}
                                alt={
                                    getTranslatedField(
                                        imageDetails.alt,
                                        currentLocale,
                                    ) || title
                                }
                                sizes="(max-width: 600px) 90vw, (max-width: 960px) 80vw, 1200px"
                            />
                        </StyledPictureElement>
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
    const { getTranslatedField, currentLocale } = useLocale(); // Use hook
    const itemTitleObject = page.props.item?.title;
    const titleForLayout = getTranslatedField(
        itemTitleObject,
        currentLocale,
        "Content",
    );
    return <PublicLayout title={titleForLayout}>{page}</PublicLayout>;
};
