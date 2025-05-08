import React from "react";
import { Head, Link as InertiaLink, usePage } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    Button,
    Link as MuiLink,
    CardActionArea,
    Avatar,
    Divider,
    Tooltip,
    IconButton,
} from "@mui/material"; // Added Tooltip, IconButton
import ContentCard from "@/Components/ContentCard";
import ThematicSectionCarousel from "@/Components/ThematicSectionCarousel";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn"; // Added LinkedIn
import LinkIcon from "@mui/icons-material/Link";

const SocialIcon = ({ platform }) => {
    switch (platform?.toLowerCase()) {
        case "facebook":
            return <FacebookIcon />;
        case "x":
            return <TwitterIcon />;
        case "twitter":
            return <TwitterIcon />;
        case "youtube":
            return <YouTubeIcon />;
        case "instagram":
            return <InstagramIcon />;
        case "telegram":
            return <TelegramIcon />;
        case "linkedin":
            return <LinkedInIcon />; // Added LinkedIn case
        default:
            return <LinkIcon />;
    }
};

const getTranslatedField = (fieldObject, locale = "en", fallback = "") => {
    const { props } = usePage();
    const currentLocale = props.locale || locale;
    if (fieldObject == null) {
        return fallback;
    }
    if (typeof fieldObject !== "object") {
        return String(fieldObject) || fallback;
    }
    return (
        fieldObject[currentLocale] ||
        fieldObject[locale] ||
        Object.values(fieldObject)[0] ||
        fallback
    );
};

// --- Section Specific Components ---

const VisionSection = ({ section }) => (
    <Paper
        sx={{
            p: { xs: 2, md: 4 },
            textAlign: "center",
            mb: 4,
            bgcolor: "secondary.main",
        }}
    >
        <Typography variant="h3" component="h1" gutterBottom color="primary">
            {getTranslatedField(section.title)}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, fontStyle: "italic" }}>
            {getTranslatedField(section.subtitle_or_quote)}
        </Typography>
        {section.config?.button_text && section.config?.button_link && (
            <Button
                component={InertiaLink}
                href={section.config.button_link} // Assuming direct link or pre-resolved route name
                variant="contained"
                size="large"
            >
                {getTranslatedField(section.config.button_text)}
            </Button>
        )}
    </Paper>
);

const LatestNewsSection = ({ section }) => (
    <Box sx={{ mb: 4 }}>
        {" "}
        {/* Wrap section content in a Box */}
        <Typography variant="h5" component="h2" gutterBottom>
            {getTranslatedField(section.title)}
        </Typography>
        <Grid container spacing={2}>
            {section.items?.map((item) => (
                <Grid item xs={12} sm={6} key={`news-${item.id}`}>
                    <Card variant="outlined">
                        <CardContent>
                            {item.category_name && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                >
                                    {getTranslatedField(item.category_name)}
                                </Typography>
                            )}
                            <MuiLink
                                component={InertiaLink}
                                href={route("content.show-item", item.slug)}
                                underline="hover"
                                variant="h6"
                                sx={{ display: "block", mb: 0.5 }}
                            >
                                {getTranslatedField(item.title)}
                            </MuiLink>
                            <Typography variant="body2" color="text.secondary">
                                {item.publish_date_formatted}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            {section.items?.length === 0 && (
                <Grid item xs={12}>
                    <Typography sx={{ p: 2 }}>
                        No news items to display.
                    </Typography>
                </Grid>
            )}
        </Grid>
        {/* Consider adding a "View All News" link if applicable */}
    </Box>
);

const FeaturedQuoteSection = ({ section }) =>
    section.quote_data ? (
        <Paper sx={{ p: 2, mb: 3, position: "relative", bgcolor: "grey.100" }}>
            {section.title && (
                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ textAlign: "center" }}
                >
                    {getTranslatedField(section.title)}
                </Typography>
            )}
            <FormatQuoteIcon
                sx={{
                    position: "absolute",
                    top: section.title ? 35 : 8,
                    left: 8,
                    fontSize: "3rem",
                    opacity: 0.1,
                }}
            />
            <Typography variant="body1" sx={{ fontStyle: "italic", mb: 1 }}>
                "{getTranslatedField(section.quote_data.text)}"
            </Typography>
            <Typography
                variant="caption"
                color="text.secondary"
                align="right"
                display="block"
            >
                - {getTranslatedField(section.quote_data.source) || "Unknown"}
            </Typography>
        </Paper>
    ) : null;

// Updated: This component now renders based on globally shared accounts, but uses the section title
const SocialMediaLinksSection = ({ section }) => {
    const { socialAccounts } = usePage().props; // Get globally shared social accounts
    if (!socialAccounts || socialAccounts.length === 0) return null;

    return (
        <Box sx={{ mb: 4 }}>
            {" "}
            {/* Wrap section content in a Box */}
            <Typography variant="h5" component="h2" gutterBottom>
                {getTranslatedField(section.title)}{" "}
                {/* Use title from section data */}
            </Typography>
            <Grid container spacing={1}>
                {socialAccounts.map((acc) => (
                    <Grid item xs={12} sm={6} key={`social-link-${acc.id}`}>
                        <Card variant="outlined">
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
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: "primary.light" }}>
                                        <SocialIcon platform={acc.platform} />
                                    </Avatar>
                                    <Box>
                                        <Typography
                                            variant="body1"
                                            fontWeight="medium"
                                        >
                                            {getTranslatedField(
                                                acc.account_name,
                                            ) ||
                                                acc.platform
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    acc.platform.slice(1)}
                                        </Typography>
                                        {getTranslatedField(
                                            acc.account_name,
                                        ) && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {acc.platform
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    acc.platform.slice(1)}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
// --- End Section Specific Components ---

export default function Welcome({
    settings,
    homepageSections,
    genericFeaturedItems,
}) {
    const siteName = getTranslatedField(
        settings?.site_name?.value,
        "en",
        "Personality Platform",
    );
    const pageTitle = `Welcome - ${siteName}`;

    // Helper to render a section based on its type
    const renderSection = (section) => {
        switch (section.section_type) {
            case "vision":
                return (
                    <VisionSection
                        key={`section-${section.id}`}
                        section={section}
                    />
                );
            case "thematic_carousel":
                return (
                    <React.Fragment key={`section-${section.id}`}>
                        <ThematicSectionCarousel
                            title={getTranslatedField(section.title)}
                            items={section.items || []}
                            sectionQuote={getTranslatedField(
                                section.subtitle_or_quote,
                            )}
                        />
                        <Divider sx={{ my: 3 }} />
                    </React.Fragment>
                );
            case "latest_news":
                // Wrap in Grid item if needed for layout, but rendering directly here
                return (
                    <LatestNewsSection
                        key={`section-${section.id}`}
                        section={section}
                    />
                );
            case "featured_quote":
                // Render directly, assuming it's placed in a sidebar or specific layout area
                return (
                    <FeaturedQuoteSection
                        key={`section-${section.id}`}
                        section={section}
                    />
                );
            case "social_media_links":
                // Render directly
                return (
                    <SocialMediaLinksSection
                        key={`section-${section.id}`}
                        section={section}
                    />
                );
            default:
                return (
                    <Typography key={`section-${section.id}`}>
                        Unsupported section type: {section.section_type}
                    </Typography>
                );
        }
    };

    return (
        <>
            <Head title={pageTitle} />

            {/* Render sections based on the order defined in homepageSections */}
            {homepageSections &&
                homepageSections.map((section) => renderSection(section))}

            {/* Optional: Render generic featured items if they exist and aren't covered by dynamic sections */}
            {genericFeaturedItems &&
                genericFeaturedItems.length > 0 &&
                !homepageSections.some((s) =>
                    ["thematic_carousel", "latest_news"].includes(
                        s.section_type,
                    ),
                ) && ( // Example condition: only show if no dynamic content sections exist
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Featured Content
                        </Typography>
                        <Grid container spacing={3}>
                            {genericFeaturedItems.map((item) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={`generic-featured-${item.id}`}
                                >
                                    <ContentCard item={item} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
        </>
    );
}

Welcome.layout = (page) => <PublicLayout children={page} />;
