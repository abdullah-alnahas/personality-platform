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
import { styled } from "@mui/material/styles"; // Import styled utility
import { Link as InertiaLink, usePage } from "@inertiajs/react";

// Styled component for the <picture> element
const StyledPicture = styled("picture")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "block", // Ensure picture element behaves as a block
});

// getTranslatedField and buildSrcSet helpers remain the same
const getTranslatedField = (fieldObject, locale = "en", fallback = "") => {
    const { props } = usePage();
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

const buildSrcSet = (sources) => {
    if (!sources || !Array.isArray(sources) || sources.length === 0) return "";
    return sources.map((source) => `${source.url} ${source.width}w`).join(", ");
};

export default function ContentCard({ item }) {
    const { props: pageProps } = usePage();
    if (!item) return null;

    const title = getTranslatedField(item.title, pageProps.locale);
    const excerpt = getTranslatedField(item.excerpt, pageProps.locale);
    const categoryName = getTranslatedField(
        item.category_name,
        pageProps.locale,
    );

    const imageDetails = item.image_details;
    let displayImageSrc =
        imageDetails?.thumbnail_jpg || imageDetails?.original_url;
    let displayImageSrcSetWebP = null;
    let displayImageSrcSetJpg = null;

    const imageAspectRatioBoxSx = {
        width: "100%",
        paddingTop: "56.25%", // 16:9
        position: "relative",
        backgroundColor:
            imageDetails && displayImageSrc ? "transparent" : "grey.200",
    };

    if (imageDetails) {
        if (imageDetails.thumbnail_webp) {
            displayImageSrc = imageDetails.thumbnail_webp;
        } else if (imageDetails.thumbnail_jpg) {
            displayImageSrc = imageDetails.thumbnail_jpg;
        }

        const webpCardSources = [];
        if (imageDetails.thumbnail_webp)
            webpCardSources.push({
                url: imageDetails.thumbnail_webp,
                width: 150,
            });
        (imageDetails.webp_sources || [])
            .filter((s) => s.width <= 320)
            .forEach((s) => {
                if (!webpCardSources.some((existing) => existing.url === s.url))
                    webpCardSources.push(s);
            });

        const jpgCardSources = [];
        if (imageDetails.thumbnail_jpg)
            jpgCardSources.push({
                url: imageDetails.thumbnail_jpg,
                width: 150,
            });
        (imageDetails.jpg_sources || [])
            .filter((s) => s.width <= 320)
            .forEach((s) => {
                if (!jpgCardSources.some((existing) => existing.url === s.url))
                    jpgCardSources.push(s);
            });

        if (webpCardSources.length > 0) {
            displayImageSrcSetWebP = buildSrcSet(webpCardSources);
        }
        if (jpgCardSources.length > 0) {
            displayImageSrcSetJpg = buildSrcSet(jpgCardSources);
        }
        if (
            !displayImageSrc ||
            (displayImageSrc === imageDetails.original_url &&
                (jpgCardSources.length > 0 || webpCardSources.length > 0))
        ) {
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
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
            >
                <Box sx={imageAspectRatioBoxSx}>
                    {imageDetails && displayImageSrc ? (
                        <StyledPicture>
                            {" "}
                            {/* Use styled component */}
                            {displayImageSrcSetWebP && (
                                <source
                                    srcSet={displayImageSrcSetWebP}
                                    type="image/webp"
                                    sizes="(max-width: 600px) 50vw, 320px"
                                />
                            )}
                            {displayImageSrcSetJpg && (
                                <source
                                    srcSet={displayImageSrcSetJpg}
                                    type="image/jpeg"
                                    sizes="(max-width: 600px) 50vw, 320px"
                                />
                            )}
                            <CardMedia // CardMedia already accepts sx prop and renders an <img>
                                component="img"
                                image={displayImageSrc}
                                alt={imageDetails.alt || title}
                                sx={{
                                    position: "absolute", // sx prop is fine for CardMedia
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                // The sizes attribute on CardMedia's img would be:
                                // imageProps={{ sizes: "(max-width: 600px) 50vw, 320px" }}
                                // However, the <source> elements already have 'sizes'.
                                // For the fallback img, its src is a single image, so sizes might not be strictly needed IF sources handle all cases.
                                // But it's good for robustness if the browser ignores <source> and uses <img> with srcset (not used here)
                            />
                        </StyledPicture>
                    ) : (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                No Image
                            </Typography>
                        </Box>
                    )}
                </Box>
                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
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
                    </Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-word", mt: "auto" }}
                    >
                        {excerpt || "Read more..."}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
