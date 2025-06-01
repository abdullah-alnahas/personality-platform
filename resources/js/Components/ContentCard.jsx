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
import { styled } from "@mui/material/styles";
import { Link as InertiaLink } from "@inertiajs/react";
import { useLocale } from "@/Hooks/useLocale"; // Import the hook

const StyledPicture = styled("picture")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "block",
});

const buildSrcSet = (sources) => {
    if (!sources || !Array.isArray(sources) || sources.length === 0) return "";
    return sources.map((source) => `${source.url} ${source.width}w`).join(", ");
};

export default function ContentCard({ item }) {
    const { getTranslatedField, currentLocale } = useLocale(); // Use the hook

    if (!item) return null;

    const title = getTranslatedField(item.title, currentLocale);
    const excerpt = getTranslatedField(item.excerpt, currentLocale);
    const categoryName = getTranslatedField(item.category_name, currentLocale);
    const imageDetails = item.image_details;

    let displayImageSrc =
        imageDetails?.thumbnail_jpg || imageDetails?.original_url;
    let displayImageSrcSetWebP = null;
    let displayImageSrcSetJpg = null;

    const imageAspectRatioBoxSx = {
        width: "100%",
        paddingTop: "56.25%", // 16:9 aspect ratio
        position: "relative",
        backgroundColor:
            imageDetails && displayImageSrc ? "transparent" : "grey.200", // Placeholder bg
    };

    if (imageDetails) {
        if (imageDetails.thumbnail_webp)
            displayImageSrc = imageDetails.thumbnail_webp;
        else if (imageDetails.thumbnail_jpg)
            displayImageSrc = imageDetails.thumbnail_jpg;

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

        if (webpCardSources.length > 0)
            displayImageSrcSetWebP = buildSrcSet(webpCardSources);
        if (jpgCardSources.length > 0)
            displayImageSrcSetJpg = buildSrcSet(jpgCardSources);

        // Fallback displayImageSrc if only original_url or specific conversions are available
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
                            <CardMedia
                                component="img"
                                image={displayImageSrc}
                                alt={
                                    getTranslatedField(
                                        imageDetails.alt,
                                        currentLocale,
                                    ) || title
                                } // Use translated alt
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
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
                                sx={{
                                    mb: 1,
                                    "&:hover": {
                                        cursor: "pointer",
                                        backgroundColor: "action.hover",
                                    },
                                }}
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
