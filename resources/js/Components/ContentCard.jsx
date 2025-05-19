import React from "react";
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Typography,
    Chip,
    Box,
} from "@mui/material"; // Added Box
import { Link as InertiaLink, usePage } from "@inertiajs/react";

const getTranslatedField = (fieldObject, locale = "en", fallback = "") => {
    const { props } = usePage(); // Ensure usePage is called within the component or a hook
    const currentLocale = props.locale || locale;
    if (fieldObject == null) return fallback;
    if (typeof fieldObject !== "object") return String(fieldObject) || fallback;
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

export default function ContentCard({ item }) {
    const { props } = usePage(); // Call usePage at the top level of the component
    if (!item) return null;

    const title = getTranslatedField(item.title, props.locale);
    const excerpt = getTranslatedField(item.excerpt, props.locale);
    const categoryName = getTranslatedField(item.category_name, props.locale);

    // Use thumbnail for card, prioritizing WebP
    const imageDetails = item.image_details;
    let displayImageSrc =
        imageDetails?.thumbnail_jpg || imageDetails?.original_url; // Fallback
    let displayImageSrcSetWebP = null;
    let displayImageSrcSetJpg = null;

    if (imageDetails) {
        if (imageDetails.thumbnail_webp) {
            displayImageSrc = imageDetails.thumbnail_webp; // Prioritize WebP thumbnail
        }
        // For a simple card, we might just use the thumbnail.
        // If we want the card media to be responsive too, we'd build full srcset here.
        // For now, let's assume thumbnail is sufficient for the card's <CardMedia>
        // and full responsive handling will be on the detail page.
        // However, providing a small srcset for the card image is still good practice.

        // Example: use 'sm' sizes for card media srcset if available
        const webpSmallSources =
            imageDetails.webp_sources?.filter((s) => s.width <= 320) || [];
        const jpgSmallSources =
            imageDetails.jpg_sources?.filter((s) => s.width <= 320) || [];

        if (webpSmallSources.length > 0) {
            displayImageSrcSetWebP = buildSrcSet(webpSmallSources);
        }
        if (jpgSmallSources.length > 0) {
            displayImageSrcSetJpg = buildSrcSet(jpgSmallSources);
        }
        // Fallback for displayImageSrc if only specific responsive sources are available
        if (displayImageSrc === imageDetails?.original_url) {
            // if thumbnail was not found
            displayImageSrc =
                imageDetails.jpg_sources?.[0]?.url ||
                imageDetails.webp_sources?.[0]?.url ||
                imageDetails.original_url;
        }
    }

    return (
        <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <CardActionArea
                component={InertiaLink}
                href={route("content.show-item", item.slug)}
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
                {imageDetails && displayImageSrc ? (
                    <Box
                        sx={{
                            width: "100%",
                            paddingTop: "56.25%",
                            position: "relative",
                        }}
                    >
                        {" "}
                        {/* 16:9 Aspect Ratio Box */}
                        <picture
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            {displayImageSrcSetWebP && (
                                <source
                                    srcSet={displayImageSrcSetWebP}
                                    type="image/webp"
                                />
                            )}
                            {displayImageSrcSetJpg && (
                                <source
                                    srcSet={displayImageSrcSetJpg}
                                    type="image/jpeg"
                                />
                            )}
                            <CardMedia
                                component="img"
                                image={displayImageSrc} // Fallback src for <img>
                                alt={imageDetails.alt || title}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </picture>
                    </Box>
                ) : (
                    // Optional: Placeholder if no image
                    <Box
                        sx={{
                            height: 160,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.200",
                            width: "100%",
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            No Image
                        </Typography>
                    </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{ mb: 1, wordBreak: "break-word" }}
                    >
                        {title}
                    </Typography>
                    {categoryName && item.category_slug && (
                        <Chip
                            label={categoryName}
                            size="small"
                            variant="outlined"
                            component={InertiaLink}
                            href={route(
                                "content.show-category",
                                item.category_slug,
                            )}
                            clickable
                            sx={{ mb: 1 }}
                        />
                    )}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-word" }}
                    >
                        {excerpt || "Read more..."}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
