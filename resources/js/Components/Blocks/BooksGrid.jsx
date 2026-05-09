import React, { useRef } from "react";
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
    IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocale } from "@/Hooks/useLocale";
import { safeUrl } from "@/utils/sanitize";

const BooksGrid = ({ block }) => {
    const { currentLocale, isRTL, getTranslatedField: t } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};
    const books = block?.resolved_data || [];

    const bgColor = config.background_color || "#1E2A22";
    const textColor = config.text_color || "#ffffff";
    const accentColor = config.accent_color || "#C9A94E";
    const columns = config.columns || 4;
    const mdCols = Math.max(1, Math.min(12, Math.floor(12 / columns)));
    const layout = config.layout || "grid";

    const noCoverLabel = currentLocale === 'ar' ? 'لا يوجد غلاف' : currentLocale === 'tr' ? 'Kapak Yok' : 'No Cover';
    const noBooksLabel = currentLocale === 'ar' ? 'لا توجد كتب.' : currentLocale === 'tr' ? 'Kitap bulunamadı.' : 'No books found.';
    const readLabel = currentLocale === 'ar' ? 'قراءة' : currentLocale === 'tr' ? 'Oku' : 'Read';

    const scrollerRef = useRef(null);
    const scrollBy = (direction) => {
        const el = scrollerRef.current;
        if (!el) return;
        const delta = el.clientWidth * 0.8 * direction;
        el.scrollBy({ left: delta, behavior: "smooth" });
    };

    const renderCard = (book) => (
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
                    <Typography sx={{ opacity: 0.4, fontSize: "0.75rem" }}>
                        {noCoverLabel}
                    </Typography>
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
                        href={safeUrl(book.buy_link)}
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
                        {readLabel}
                    </Button>
                </CardActions>
            )}
        </Card>
    );

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
                ) : layout === "carousel" ? (
                    <Box sx={{ position: "relative" }}>
                        <IconButton
                            aria-label="previous"
                            onClick={() => scrollBy(isRTL ? 1 : -1)}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                insetInlineStart: -16,
                                transform: "translateY(-50%)",
                                zIndex: 2,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                color: textColor,
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                            }}
                        >
                            {isRTL ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                        <IconButton
                            aria-label="next"
                            onClick={() => scrollBy(isRTL ? -1 : 1)}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                insetInlineEnd: -16,
                                transform: "translateY(-50%)",
                                zIndex: 2,
                                backgroundColor: "rgba(255,255,255,0.1)",
                                color: textColor,
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                            }}
                        >
                            {isRTL ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                        <Box
                            ref={scrollerRef}
                            sx={{
                                display: "flex",
                                gap: 3,
                                overflowX: "auto",
                                overflowY: "hidden",
                                scrollSnapType: "x mandatory",
                                scrollbarWidth: "none",
                                "&::-webkit-scrollbar": { display: "none" },
                                py: 1,
                            }}
                        >
                            {books.map((book) => (
                                <Box
                                    key={book.id}
                                    sx={{
                                        flex: "0 0 auto",
                                        width: { xs: "65%", sm: "40%", md: "25%" },
                                        scrollSnapAlign: "start",
                                    }}
                                >
                                    {renderCard(book)}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ) : (
                    <Grid container spacing={3} justifyContent="center">
                        {books.map((book) => (
                            <Grid size={{ xs: 6, sm: 4, md: mdCols }} key={book.id}>
                                {renderCard(book)}
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default BooksGrid;
