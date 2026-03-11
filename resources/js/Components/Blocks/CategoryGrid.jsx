import React from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Chip,
    Container,
} from "@mui/material";
import { Link as InertiaLink } from "@inertiajs/react";
import { useLocale } from "@/Hooks/useLocale";

export default function CategoryGrid({ block }) {
    const { getTranslatedField, currentLocale } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};
    const resolvedData = block?.resolved_data || {};

    const heading = getTranslatedField(content.heading, currentLocale);
    const description = getTranslatedField(content.description, currentLocale);
    const items = resolvedData.items || [];
    const columns = config.columns || 3;

    const mdCols = 12 / Math.min(columns, 4);

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            {heading && (
                <Typography
                    variant="h4"
                    component="h2"
                    align="center"
                    sx={{
                        fontWeight: 700,
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                        mb: 1,
                    }}
                >
                    {heading}
                </Typography>
            )}
            {description && (
                <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    sx={{
                        mb: 5,
                        maxWidth: 600,
                        mx: "auto",
                        lineHeight: 1.7,
                    }}
                >
                    {description}
                </Typography>
            )}
            {items.length > 0 ? (
                <Grid container spacing={3}>
                    {items.map((item) => {
                        const title = getTranslatedField(
                            item.title,
                            currentLocale,
                        );
                        const excerpt = getTranslatedField(
                            item.excerpt,
                            currentLocale,
                        );
                        const categoryName = getTranslatedField(
                            item.category_name,
                            currentLocale,
                        );
                        const imageUrl =
                            item.image_details?.thumbnail_jpg ||
                            item.image_details?.original_url ||
                            "";

                        return (
                            <Grid item xs={12} sm={6} md={mdCols} key={item.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                        "&:hover": {
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
                                        },
                                    }}
                                >
                                    <CardActionArea
                                        component={InertiaLink}
                                        href={route("content.show-item", item.slug)}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            flexGrow: 1,
                                            alignItems: "stretch",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: "100%",
                                                paddingTop: "56.25%",
                                                position: "relative",
                                                bgcolor: "grey.100",
                                            }}
                                        >
                                            {imageUrl ? (
                                                <CardMedia
                                                    component="img"
                                                    image={imageUrl}
                                                    alt={title}
                                                    sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
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
                                                p: 2.5,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    mb: 1,
                                                }}
                                            >
                                                {categoryName && (
                                                    <Chip
                                                        label={categoryName}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        sx={{ fontSize: "0.7rem" }}
                                                    />
                                                )}
                                                {item.publish_date_formatted && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {item.publish_date_formatted}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: "1rem",
                                                    lineHeight: 1.4,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {title}
                                            </Typography>
                                            {excerpt && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: "auto",
                                                        lineHeight: 1.6,
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {excerpt}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <Typography
                    align="center"
                    color="text.secondary"
                    sx={{ py: 4 }}
                >
                    No items to display.
                </Typography>
            )}
        </Container>
    );
}
