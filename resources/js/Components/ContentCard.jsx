import React from "react";
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Typography,
    Chip,
    Box,
} from "@mui/material";
import { Link as InertiaLink, usePage } from "@inertiajs/react";

/**
 * Helper function to get a translated field from a translatable object.
 * Uses the current page locale or a fallback.
 * @param {object|null|undefined} fieldObject - The object containing translations (e.g., { en: 'Hello', ar: 'مرحبا' }).
 * @param {string} [locale='en'] - The preferred locale.
 * @param {string} [fallback=''] - The fallback string if no translation is found.
 * @returns {string} The translated string or fallback.
 */
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

/**
 * Helper function to construct an srcset string from an array of image sources.
 * Each source object should have 'url' and 'width'.
 * @param {Array<{url: string, width: number}>|null|undefined} sources - Array of image source objects.
 * @returns {string} The generated srcset string (e.g., "url1 320w, url2 768w").
 */
const buildSrcSet = (sources) => {
    if (!sources || !Array.isArray(sources) || sources.length === 0) return "";
    return sources.map((source) => `${source.url} ${source.width}w`).join(", ");
};

/**
 * @typedef {object} ImageDetails
 * @property {string} [alt] - Alt text for the image.
 * @property {string} [original_url] - URL of the original image.
 * @property {Array<{url: string, width: number}>} [webp_sources] - Array of WebP sources for srcset.
 * @property {Array<{url: string, width: number}>} [jpg_sources] - Array of JPG sources for srcset.
 * @property {string} [thumbnail_webp] - URL for WebP thumbnail.
 * @property {string} [thumbnail_jpg] - URL for JPG thumbnail.
 */

/**
 * @typedef {object} ContentItemData
 * @property {number|string} id - Unique identifier for the item.
 * @property {string} slug - URL-friendly slug for the item.
 * @property {object} title - Translatable title object.
 * @property {object} [excerpt] - Translatable excerpt object.
 * @property {object} [category_name] - Translatable category name object.
 * @property {string} [category_slug] - Slug for the category link.
 * @property {ImageDetails} [image_details] - Object containing details for the featured image.
 */

/**
 * ContentCard component displays a summary of a content item.
 * It includes a featured image (responsive with WebP fallback), title, category, and excerpt.
 * The card is clickable and links to the full content item page.
 *
 * @param {object} props - The component props.
 * @param {ContentItemData} props.item - The content item data to display.
 * @returns {JSX.Element|null} The rendered ContentCard or null if no item is provided.
 */
export default function ContentCard({ item }) {
    const { props: pageProps } = usePage(); // Call usePage at the top level of the component
    if (!item) return null;

    const title = getTranslatedField(item.title, pageProps.locale);
    const excerpt = getTranslatedField(item.excerpt, pageProps.locale);
    const categoryName = getTranslatedField(
        item.category_name,
        pageProps.locale,
    );

    const imageDetails = item.image_details;
    let displayImageSrc =
        imageDetails?.thumbnail_jpg || imageDetails?.original_url; // Fallback if no specific thumbnail
    let displayImageSrcSetWebP = null;
    let displayImageSrcSetJpg = null;

    if (imageDetails) {
        if (imageDetails.thumbnail_webp) {
            displayImageSrc = imageDetails.thumbnail_webp; // Prioritize WebP thumbnail
        } else if (imageDetails.thumbnail_jpg) {
            displayImageSrc = imageDetails.thumbnail_jpg;
        }

        // Use smaller responsive sources for the card's srcset, if available
        // For cards, often 'sm' or just thumbnails are sufficient.
        const webpCardSources =
            imageDetails.webp_sources?.filter((s) => s.width <= 320) || [];
        if (
            imageDetails.thumbnail_webp &&
            !webpCardSources.some((s) => s.url === imageDetails.thumbnail_webp)
        ) {
            webpCardSources.unshift({
                url: imageDetails.thumbnail_webp,
                width: 150,
            }); // Add thumbnail as smallest
        }
        const jpgCardSources =
            imageDetails.jpg_sources?.filter((s) => s.width <= 320) || [];
        if (
            imageDetails.thumbnail_jpg &&
            !jpgCardSources.some((s) => s.url === imageDetails.thumbnail_jpg)
        ) {
            jpgCardSources.unshift({
                url: imageDetails.thumbnail_jpg,
                width: 150,
            }); // Add thumbnail as smallest
        }

        if (webpCardSources.length > 0) {
            displayImageSrcSetWebP = buildSrcSet(webpCardSources);
        }
        if (jpgCardSources.length > 0) {
            displayImageSrcSetJpg = buildSrcSet(jpgCardSources);
        }

        // Final fallback for displayImageSrc if it's still pointing to original and specific sources exist
        if (displayImageSrc === imageDetails.original_url) {
            displayImageSrc =
                jpgCardSources[0]?.url ||
                webpCardSources[0]?.url ||
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
                    // Container to enforce aspect ratio for the image area
                    <Box
                        sx={{
                            width: "100%",
                            paddingTop: "56.25%",
                            /* 16:9 Aspect Ratio */ position: "relative",
                        }}
                    >
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
                            {/* CardMedia acts as the img fallback and provides MUI styling */}
                            <CardMedia
                                component="img"
                                image={displayImageSrc}
                                alt={imageDetails.alt || title} // Use provided alt text or fall back to title
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover", // Cover the area, cropping if necessary
                                }}
                            />
                        </picture>
                    </Box>
                ) : (
                    // Optional: Placeholder if no image is available
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
                            clickable // Makes the chip behave more like a link
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
