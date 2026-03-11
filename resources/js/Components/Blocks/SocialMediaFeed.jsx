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
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkIconOriginal from "@mui/icons-material/Link";
import { useLocale } from "@/Hooks/useLocale";

const SocialIcon = ({ platform }) => {
    switch (platform?.toLowerCase()) {
        case "facebook":
            return <FacebookIcon />;
        case "x":
        case "twitter":
            return <TwitterIcon />;
        case "youtube":
            return <YouTubeIcon />;
        case "instagram":
            return <InstagramIcon />;
        case "telegram":
            return <TelegramIcon />;
        case "linkedin":
            return <LinkedInIcon />;
        default:
            return <LinkIconOriginal />;
    }
};

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
    const { getTranslatedField, currentLocale } = useLocale();
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
                        fontFamily: "'Georgia', 'Times New Roman', serif",
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
