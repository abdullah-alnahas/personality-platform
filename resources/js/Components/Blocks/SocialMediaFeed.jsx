import React from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Avatar,
    Container,
} from "@mui/material";
import SocialIcon from "@/Components/SocialIcon";
import { useLocale } from "@/Hooks/useLocale";
import { safeUrl } from "@/utils/sanitize";

const platformColors = {
    facebook: "#1877F2",
    x: "#000000",
    twitter: "#1DA1F2",
    youtube: "#FF0000",
    instagram: "#E4405F",
    telegram: "#26A5E4",
    linkedin: "#0A66C2",
};

export default function SocialMediaFeed({ block }) {
    const { getTranslatedField, currentLocale, isRTL } = useLocale();
    const content = block?.content || {};
    const resolvedData = block?.resolved_data || [];

    const heading = getTranslatedField(content.heading, currentLocale);
    const accounts = Array.isArray(resolvedData) ? resolvedData : [];

    if (accounts.length === 0) return null;

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
            {heading && (
                <Typography
                    variant="h4"
                    component="h2"
                    align="center"
                    sx={{
                        fontWeight: 700,
                        fontFamily: isRTL ? "'Amiri', serif" : "'Georgia', 'Times New Roman', serif",
                        mb: 4,
                    }}
                >
                    {heading}
                </Typography>
            )}
            <Grid container spacing={2} justifyContent="center">
                {accounts.map((acc) => {
                    const platformKey = acc.platform?.toLowerCase();
                    const bgColor = platformColors[platformKey] || "primary.main";
                    const accountName = getTranslatedField(
                        acc.account_name,
                        currentLocale,
                    );
                    const displayName =
                        accountName ||
                        (acc.platform
                            ? acc.platform.charAt(0).toUpperCase() +
                              acc.platform.slice(1)
                            : "Social");

                    const previewImage = acc.preview_image_url;
                    const previewCaption = getTranslatedField(
                        acc.preview_caption,
                        currentLocale,
                    );

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={acc.id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                                    },
                                }}
                            >
                                <CardActionArea
                                    component="a"
                                    href={safeUrl(acc.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {previewImage && (
                                        <Box
                                            sx={{
                                                width: "100%",
                                                paddingTop: "100%",
                                                position: "relative",
                                                bgcolor: "grey.100",
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={previewImage}
                                                alt={displayName}
                                                sx={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <Avatar
                                                sx={{
                                                    position: "absolute",
                                                    top: 12,
                                                    [isRTL ? "left" : "right"]: 12,
                                                    bgcolor: bgColor,
                                                    width: 36,
                                                    height: 36,
                                                }}
                                            >
                                                <SocialIcon platform={acc.platform} />
                                            </Avatar>
                                        </Box>
                                    )}
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            p: 2.5,
                                        }}
                                    >
                                        {!previewImage && (
                                            <Avatar
                                                sx={{
                                                    bgcolor: bgColor,
                                                    width: 48,
                                                    height: 48,
                                                }}
                                            >
                                                <SocialIcon platform={acc.platform} />
                                            </Avatar>
                                        )}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="body1"
                                                fontWeight={600}
                                            >
                                                {displayName}
                                            </Typography>
                                            {previewCaption ? (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {previewCaption}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {acc.platform
                                                        ? acc.platform
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          acc.platform.slice(1)
                                                        : ""}
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}
