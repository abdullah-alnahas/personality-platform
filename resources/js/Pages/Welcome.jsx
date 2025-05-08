import React from 'react';
import { Head, Link as InertiaLink, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Box, Typography, Grid, Paper, Card, CardContent, Button, Link as MuiLink, CardActionArea, Avatar, Divider } from '@mui/material';
import ContentCard from '@/Components/ContentCard';
import ThematicSectionCarousel from '@/Components/ThematicSectionCarousel';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkIcon from '@mui/icons-material/Link';

const SocialIcon = ({ platform }) => { /* ... same as before ... */
    switch (platform?.toLowerCase()) {
        case 'facebook': return <FacebookIcon />;
        case 'x': return <TwitterIcon />;
        case 'twitter': return <TwitterIcon />;
        case 'youtube': return <YouTubeIcon />;
        case 'instagram': return <InstagramIcon />;
        case 'telegram': return <TelegramIcon />;
        default: return <LinkIcon />;
    }
};

const getTranslatedField = (fieldObject, locale = 'en', fallback = '') => { /* ... same as before ... */
    const { props } = usePage(); const currentLocale = props.locale || locale;
    if (fieldObject == null) { return fallback; }
    if (typeof fieldObject !== 'object') { return String(fieldObject) || fallback; }
    return fieldObject[currentLocale] || fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};

// --- Section Specific Components (can be moved to separate files later) ---

const VisionSection = ({ section }) => (
    <Paper sx={{ p: { xs: 2, md: 4 }, textAlign: 'center', mb: 4, bgcolor: 'secondary.main' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
            {getTranslatedField(section.title)}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, fontStyle: 'italic' }}>
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
    // This Grid is an item within the main page flow
    <Grid item xs={12} md={8}> {/* Default to md={8} layout for news */}
        <Typography variant="h5" component="h2" gutterBottom>
            {getTranslatedField(section.title)}
        </Typography>
        <Grid container spacing={2}>
            {section.items?.map(item => (
                <Grid item xs={12} sm={6} key={`news-${item.id}`}>
                    <Card variant="outlined">
                        <CardContent>
                            {item.category_name && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {getTranslatedField(item.category_name)}
                                </Typography>
                            )}
                            <MuiLink component={InertiaLink} href={route('content.show-item', item.slug)} underline="hover" variant="h6" sx={{ display: 'block', mb: 0.5 }}>
                                {getTranslatedField(item.title)}
                            </MuiLink>
                            <Typography variant="body2" color="text.secondary">
                                {item.publish_date_formatted}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            {section.items?.length === 0 && <Typography sx={{ p: 2 }}>No news items to display.</Typography>}
        </Grid>
        {/* Consider adding a "View All News" link if applicable */}
    </Grid>
);

const FeaturedQuoteSection = ({ section }) => (
    section.quote_data ? (
        <Paper sx={{ p: 2, mb: 3, position: 'relative', bgcolor: 'grey.100' }}>
            {section.title && (
                <Typography variant="h6" component="h3" gutterBottom sx={{ textAlign: 'center' }}>
                    {getTranslatedField(section.title)}
                </Typography>
            )}
            <FormatQuoteIcon sx={{ position: 'absolute', top: section.title ? 35 : 8, left: 8, fontSize: '3rem', opacity: 0.1 }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                "{getTranslatedField(section.quote_data.text)}"
            </Typography>
            <Typography variant="caption" color="text.secondary" align="right" display="block">
                - {getTranslatedField(section.quote_data.source) || 'Unknown'}
            </Typography>
        </Paper>
    ) : null
);

const SocialMediaLinksSection = ({ section }) => {
    const { socialAccounts } = usePage().props; // Get globally shared social accounts
    if (!socialAccounts || socialAccounts.length === 0) return null;

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                {getTranslatedField(section.title)}
            </Typography>
            <Grid container spacing={1}> {/* Reduced spacing for a tighter look if preferred */}
                {socialAccounts.map(acc => (
                    <Grid item xs={12} sm={6} key={`social-link-${acc.id}`}> {/* Two columns on small screens */}
                        <Card variant="outlined">
                            <CardActionArea component="a" href={acc.url} target="_blank" rel="noopener noreferrer">
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                                        <SocialIcon platform={acc.platform} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1" fontWeight="medium">
                                            {getTranslatedField(acc.account_name) || (acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1))}
                                        </Typography>
                                        {getTranslatedField(acc.account_name) && (
                                            <Typography variant="caption" color="text.secondary">
                                                {acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1)}
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


export default function Welcome({ settings, homepageSections, genericFeaturedItems }) {
    const siteName = getTranslatedField(settings?.site_name?.value, 'en', 'Personality Platform');
    const pageTitle = `Welcome - ${siteName}`;

    // Helper to render a section based on its type
    const renderSection = (section) => {
        switch (section.section_type) {
            case 'vision':
                return <VisionSection key={section.id} section={section} />;
            case 'thematic_carousel':
                return (
                    <React.Fragment key={section.id}>
                        <ThematicSectionCarousel
                            title={getTranslatedField(section.title)}
                            items={section.items || []} // Pass items fetched by controller
                            sectionQuote={getTranslatedField(section.subtitle_or_quote)}
                        />
                        <Divider sx={{ my: 3 }} />
                    </React.Fragment>
                );
            case 'latest_news':
                // Wrap in Grid item if it's part of a larger Grid layout
                return <LatestNewsSection key={section.id} section={section} />;
            case 'featured_quote':
                // This might be part of a sidebar, so no Grid item wrapper here directly
                return <FeaturedQuoteSection key={section.id} section={section} />;
            case 'social_media_links':
                // This might also be part of a sidebar
                return <SocialMediaLinksSection key={section.id} section={section} />;
            default:
                return <Typography key={section.id}>Unsupported section type: {section.section_type}</Typography>;
        }
    };

    // Group sections for layout (e.g., main content vs sidebar)
    const mainContentSections = homepageSections.filter(s => ['vision', 'thematic_carousel', 'latest_news'].includes(s.section_type));
    const sidebarSections = homepageSections.filter(s => ['featured_quote', 'social_media_links'].includes(s.section_type));

    return (
        <>
            <Head title={pageTitle} />

            {/* Render Vision section if configured first */}
            {mainContentSections.find(s => s.section_type === 'vision') &&
                renderSection(mainContentSections.find(s => s.section_type === 'vision'))
            }

            {/* Render Thematic Carousels */}
            {mainContentSections.filter(s => s.section_type === 'thematic_carousel').map(section => renderSection(section))}


            <Grid container spacing={4} sx={{ mt: 2 }}>
                {/* Render Latest News if configured */}
                {mainContentSections.find(s => s.section_type === 'latest_news') &&
                    renderSection(mainContentSections.find(s => s.section_type === 'latest_news'))
                }

                {/* Generic Featured Items (if still needed and not replaced by thematic sections) */}
                {genericFeaturedItems && genericFeaturedItems.length > 0 &&
                    !mainContentSections.some(s => s.section_type === 'thematic_carousel') && /* Example: only show if no thematic carousels */ (
                        <Grid item xs={12}>
                            <Typography variant="h5" component="h2" gutterBottom>Featured Content</Typography>
                            <Grid container spacing={3}>
                                {genericFeaturedItems.map(item => (
                                    <Grid item xs={12} sm={6} md={4} key={`generic-featured-${item.id}`}>
                                        <ContentCard item={item} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    )}


                {/* Right Sidebar Area */}
                {sidebarSections.length > 0 && (
                    <Grid item xs={12} md={4}>
                        {sidebarSections.map(section => renderSection(section))}
                    </Grid>
                )}
            </Grid>
        </>
    );
}

Welcome.layout = page => <PublicLayout children={page} />;
