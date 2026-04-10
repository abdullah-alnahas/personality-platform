import React from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Chip,
} from "@mui/material";
import { useLocale } from "@/Hooks/useLocale";

const BooksGrid = ({ block }) => {
    const { currentLocale, isRTL } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};
    const books = block?.resolved_data || [];

    const t = (field) => {
        if (!field) return "";
        if (typeof field === "string") return field;
        return field[currentLocale] || field.ar || field.en || Object.values(field)[0] || "";
    };

    const bgColor = config.background_color || "#1E2A22";
    const textColor = config.text_color || "#ffffff";
    const accentColor = "#C9A94E";
    const columns = config.columns || 4;
    const mdCols = Math.max(1, Math.min(12, Math.floor(12 / columns)));

    const noCoverLabel = currentLocale === 'ar' ? 'لا يوجد غلاف' : currentLocale === 'tr' ? 'Kapak Yok' : '';
    const noBooksLabel = currentLocale === 'ar' ? 'لا توجد كتب.' : currentLocale === 'tr' ? 'Kitap bulunamadı.' : 'No books found.';

    return (
        <Box
            component="section"
            sx={{
                backgroundColor: bgColor,
                color: textColor,
                py: config.padding_y === "xl" ? 10 : 7,
                position: "relative",
            }}
        >
            <Container maxWidth="lg">
                {content.heading && (
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{
                            fontFamily: "'Amiri', serif",
                            color: accentColor,
                            fontWeight: 700,
                            mb: content.subtitle ? 1 : 6,
                            direction: isRTL ? 'rtl' : 'ltr',
                        }}
                    >
                        {t(content.heading)}
                    </Typography>
                )}
                {content.subtitle && (
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{ mb: 6, opacity: 0.8 }}
                    >
                        {t(content.subtitle)}
                    </Typography>
                )}

                {books.length === 0 ? (
                    <Typography align="center" sx={{ opacity: 0.5, py: 4 }}>
                        {noBooksLabel}
                    </Typography>
                ) : (
                    <Grid container spacing={3} justifyContent="center">
                        {books.map((book) => (
                            <Grid item xs={6} sm={4} md={mdCols} key={book.id}>
                                <Card
                                    sx={{
                                        backgroundColor: "transparent",
                                        boxShadow: "none",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    {book.cover_image_url ? (
                                        <CardMedia
                                            component="img"
                                            image={book.cover_image_url}
                                            alt={t(book.title)}
                                            sx={{
                                                height: 220,
                                                objectFit: "contain",
                                                borderRadius: 1,
                                                backgroundColor: "rgba(255,255,255,0.05)",
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                height: 220,
                                                backgroundColor: "rgba(255,255,255,0.08)",
                                                borderRadius: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {noCoverLabel && (
                                                <Typography sx={{ opacity: 0.4, fontSize: "0.75rem" }}>
                                                    {noCoverLabel}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                    <CardContent sx={{ px: 0, pt: 1, pb: 0, flexGrow: 1 }}>
                                        {book.category && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: accentColor,
                                                    fontFamily: "'Tajawal', sans-serif",
                                                    display: "block",
                                                    mb: 0.5,
                                                }}
                                            >
                                                {book.category}
                                            </Typography>
                                        )}
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: "'Tajawal', sans-serif",
                                                fontWeight: 600,
                                                color: textColor,
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {t(book.title)}
                                        </Typography>
                                    </CardContent>
                                    {book.buy_link && (
                                        <CardActions sx={{ px: 0, pt: 1 }}>
                                            <Button
                                                size="small"
                                                href={book.buy_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="outlined"
                                                sx={{
                                                    borderColor: accentColor,
                                                    color: accentColor,
                                                    fontSize: "0.75rem",
                                                    py: 0.25,
                                                    "&:hover": {
                                                        backgroundColor: accentColor,
                                                        color: "#1E2A22",
                                                    },
                                                }}
                                            >
                                                {currentLocale === 'ar' ? 'قراءة' : currentLocale === 'tr' ? 'Oku' : 'Read'}
                                            </Button>
                                        </CardActions>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default BooksGrid;
