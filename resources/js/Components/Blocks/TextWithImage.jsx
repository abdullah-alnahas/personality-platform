import React from "react";
import {
    Box,
    Typography,
    Grid,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocale } from "@/Hooks/useLocale";

/**
 * Split layout section with text and image.
 * NOTE: Body HTML content is sanitized server-side before storage.
 * Uses dangerouslySetInnerHTML intentionally for pre-sanitized rich text.
 */
export default function TextWithImage({ block }) {
    const { getTranslatedField, currentLocale } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};

    const heading = getTranslatedField(content.heading, currentLocale);
    const body = getTranslatedField(content.body, currentLocale);
    const image = content.image_url || "";
    const imageAlt = getTranslatedField(content.image_alt, currentLocale, "");
    const imagePosition = content.image_position || "right";
    const items = content.items || [];

    const imageOrder = imagePosition === "left"
        ? { xs: 0, md: 0 }
        : { xs: 0, md: 1 };
    const textOrder = imagePosition === "left"
        ? { xs: 1, md: 1 }
        : { xs: 1, md: 0 };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ order: textOrder }}
                >
                    {heading && (
                        <Typography
                            variant="h4"
                            component="h2"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                fontFamily: "'Georgia', 'Times New Roman', serif",
                                lineHeight: 1.3,
                                mb: 2,
                            }}
                        >
                            {heading}
                        </Typography>
                    )}
                    {body && (
                        <Box
                            sx={{
                                "& p": {
                                    fontSize: "1.05rem",
                                    lineHeight: 1.8,
                                    color: "text.secondary",
                                    mb: 2,
                                },
                                "& a": {
                                    color: "primary.main",
                                },
                                mb: items.length > 0 ? 2 : 0,
                            }}
                            dangerouslySetInnerHTML={{ __html: body }}
                        />
                    )}
                    {items.length > 0 && (
                        <List disablePadding>
                            {items.map((item, index) => (
                                <ListItem
                                    key={index}
                                    disableGutters
                                    sx={{ py: 0.5 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <CheckCircleOutlineIcon
                                            sx={{
                                                color: "primary.main",
                                                fontSize: 22,
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={getTranslatedField(
                                            item.text || item,
                                            currentLocale,
                                        )}
                                        primaryTypographyProps={{
                                            fontSize: "0.95rem",
                                            color: "text.secondary",
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ order: imageOrder }}
                >
                    {image && (
                        <Box
                            component="img"
                            src={image}
                            alt={imageAlt || heading || ""}
                            sx={{
                                width: "100%",
                                height: "auto",
                                borderRadius: 3,
                                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                                objectFit: "cover",
                                maxHeight: 500,
                            }}
                        />
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}
