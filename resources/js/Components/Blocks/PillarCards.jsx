import React from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Container,
    List,
    ListItem,
    ListItemText,
    Button,
} from "@mui/material";
import { Link as InertiaLink } from "@inertiajs/react";
import { useLocale } from "@/Hooks/useLocale";
import CircleIcon from "@mui/icons-material/Circle";

export default function PillarCards({ block }) {
    const { getTranslatedField, currentLocale } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};

    const heading = getTranslatedField(content.heading, currentLocale);
    const subtitle = getTranslatedField(content.subtitle, currentLocale);
    const cards = content.cards || [];
    const columns = config.columns || 3;
    const cardVariant = config.card_variant || 'light';
    const textColor = config.text_color || null;
    const isDark = cardVariant === 'dark';

    const mdCols = 12 / Math.min(columns, 4);

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            {heading && (
                <Typography
                    variant="h3"
                    component="h2"
                    align="center"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: textColor || 'text.primary',
                    }}
                >
                    {heading}
                </Typography>
            )}
            {subtitle && (
                <Typography
                    variant="subtitle1"
                    align="center"
                    sx={{ mb: 5, maxWidth: 650, mx: "auto", lineHeight: 1.7, color: textColor ? `${textColor}cc` : 'text.secondary' }}
                >
                    {subtitle}
                </Typography>
            )}
            <Grid container spacing={3} justifyContent="center">
                {cards.map((card, index) => {
                    const cardHeading = getTranslatedField(
                        card.heading,
                        currentLocale,
                    );
                    const cardQuote = getTranslatedField(
                        card.quote,
                        currentLocale,
                    );
                    const cardImage = card.image_url || "";
                    const cardLink = card.link || "";
                    const cardLinkText = getTranslatedField(
                        card.link_text,
                        currentLocale,
                        "",
                    );
                    const subItems = card.items || [];

                    return (
                        <Grid item xs={12} sm={6} md={mdCols} key={index}>
                            <Card
                                elevation={isDark ? 2 : 0}
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: 4,
                                    border: isDark ? 'none' : "1px solid",
                                    borderColor: isDark ? 'transparent' : "divider",
                                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'background.paper',
                                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.3)" : "0 12px 40px rgba(0,0,0,0.08)",
                                    },
                                    overflow: "hidden",
                                }}
                            >
                                {cardImage && (
                                    <CardMedia
                                        component="img"
                                        image={cardImage}
                                        alt={cardHeading || ""}
                                        sx={{
                                            height: 200,
                                            objectFit: "cover",
                                        }}
                                    />
                                )}
                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        p: 3,
                                    }}
                                >
                                    {cardHeading && (
                                        <Typography
                                            variant="h5"
                                            component="h3"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 700,
                                                color: isDark ? '#C9A94E' : "primary.main",
                                            }}
                                        >
                                            {cardHeading}
                                        </Typography>
                                    )}
                                    {cardQuote && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontStyle: "italic",
                                                color: isDark ? 'rgba(255,255,255,0.7)' : "text.secondary",
                                                mb: 2,
                                                borderLeft: 3,
                                                borderColor: "primary.light",
                                                pl: 2,
                                                py: 0.5,
                                                lineHeight: 1.7,
                                            }}
                                        >
                                            {cardQuote}
                                        </Typography>
                                    )}
                                    {subItems.length > 0 && (
                                        <List disablePadding sx={{ mb: 1 }}>
                                            {subItems.map((subItem, si) => (
                                                <ListItem
                                                    key={si}
                                                    disableGutters
                                                    sx={{
                                                        py: 0.25,
                                                        alignItems: "flex-start",
                                                    }}
                                                >
                                                    <CircleIcon
                                                        sx={{
                                                            fontSize: 8,
                                                            color: "primary.light",
                                                            mt: 1,
                                                            mr: 1.5,
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <ListItemText
                                                        primary={getTranslatedField(
                                                            subItem.text || subItem,
                                                            currentLocale,
                                                        )}
                                                        primaryTypographyProps={{
                                                            variant: "body2",
                                                            color: isDark ? 'rgba(255,255,255,0.6)' : "text.secondary",
                                                            lineHeight: 1.6,
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                    {cardLink && (
                                        <Box sx={{ mt: "auto", pt: 2 }}>
                                            <Button
                                                component={InertiaLink}
                                                href={cardLink}
                                                size="small"
                                                sx={{
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {cardLinkText || cardHeading}
                                                {" \u2192"}
                                            </Button>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}
