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

                    return (
                        <Grid item xs={12} sm={6} md={4} key={acc.id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                                    },
                                }}
                            >
                                <CardActionArea
                                    component="a"
                                    href={acc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            p: 2.5,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: bgColor,
                                                width: 48,
                                                height: 48,
                                            }}
                                        >
                                            <SocialIcon platform={acc.platform} />
                                        </Avatar>
                                        <Box>
                                            <Typography
                                                variant="body1"
                                                fontWeight={600}
                                            >
                                                {displayName}
                                            </Typography>
                                            {accountName && (
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
