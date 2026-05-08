import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link as InertiaLink } from '@inertiajs/react';
import { useLocale } from '@/Hooks/useLocale';
import ScatteredStars from '@/Components/Decorative/ScatteredStars';
import { sanitizeHtml } from '@/utils/sanitize';

export default function HeroBanner({ block }) {
    const { getTranslatedField, currentLocale, isRTL } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};

    const heading = getTranslatedField(content.heading, currentLocale);
    const subtitle = getTranslatedField(content.subtitle, currentLocale);
    const ctaText = getTranslatedField(content.cta_text, currentLocale);
    const ctaLink = content.cta_link || '';
    const backgroundImage = content.background_image_url || '';
    const portraitImage = content.portrait_image_url || '';
    const overlayOpacity = content.overlay_opacity ?? 0.5;

    // Optional floating overlay card (e.g. "العلم الواجب" on the Islam hero).
    const secondaryHeading = getTranslatedField(content.secondary_heading, currentLocale);
    const secondaryBody = getTranslatedField(content.secondary_body, currentLocale);
    const secondaryCtaText = getTranslatedField(content.secondary_cta_text, currentLocale);
    const secondaryCtaLink = content.secondary_cta_link || '';
    const showSecondaryCard = !!secondaryHeading;

    const minHeight = config.min_height || '70vh';
    const textColor = config.text_color || '#ffffff';
    const layout = config.layout || 'centered';
    const showDecorations = config.show_decorations || false;
    const decorationColor = config.decoration_color || 'rgba(212, 175, 55, 0.15)';

    const textDirection = isRTL ? 'rtl' : 'ltr';
    const textAlign = isRTL ? 'right' : 'left';

    /** Shared background layer: image with overlay, or solid dark green */
    const backgroundLayer = (
        <>
            {backgroundImage ? (
                <>
                    <Box
                        component="img"
                        src={backgroundImage}
                        alt=""
                        aria-hidden="true"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 0,
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
                            zIndex: 1,
                        }}
                    />
                </>
            ) : (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#2B3D2F',
                        zIndex: 0,
                    }}
                />
            )}
        </>
    );

    /** CTA button shared by both layouts */
    const ctaButton = ctaText && ctaLink && (
        <Button
            component={InertiaLink}
            href={ctaLink}
            variant="contained"
            size="large"
            sx={{
                px: 5,
                py: 1.5,
                fontSize: '1.05rem',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                mt: 2,
            }}
        >
            {ctaText}
        </Button>
    );

    /* ------------------------------------------------------------------ */
    /*  SPLIT LAYOUT                                                       */
    /* ------------------------------------------------------------------ */
    if (layout === 'split') {
        const textColumn = (
            <Grid item xs={12} md={6} key="text">
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '100%',
                        direction: textDirection,
                        textAlign,
                        py: { xs: 6, md: 0 },
                    }}
                >
                    {heading && (
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                color: textColor,
                                fontWeight: 700,
                                mb: 2,
                                fontSize: {
                                    xs: '2rem',
                                    sm: '2.5rem',
                                    md: '3rem',
                                },
                                lineHeight: 1.2,
                            }}
                        >
                            {heading}
                        </Typography>
                    )}

                    {/* Subtitle is pre-sanitized server-side rich text */}
                    {subtitle && (
                        <Box
                            component="div"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(subtitle) }}
                            sx={{
                                color: textColor,
                                opacity: 0.9,
                                mb: 3,
                                fontSize: { xs: '1.05rem', md: '1.25rem' },
                                lineHeight: 1.7,
                                '& p': { mb: 1.5 },
                            }}
                        />
                    )}

                    {ctaButton && <Box>{ctaButton}</Box>}
                </Box>
            </Grid>
        );

        const imageColumn = (
            <Grid item xs={12} md={6} key="image">
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        py: { xs: 4, md: 0 },
                    }}
                >
                    {portraitImage && (
                        <Box
                            component="img"
                            src={portraitImage}
                            alt={heading || ''}
                            sx={{
                                maxHeight: { xs: 360, md: 480 },
                                maxWidth: '100%',
                                objectFit: 'cover',
                                borderRadius: 4,
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
                            }}
                        />
                    )}
                </Box>
            </Grid>
        );

        /* Flip column order for RTL so the portrait stays on the "end" side */
        const columns = isRTL
            ? [imageColumn, textColumn]
            : [textColumn, imageColumn];

        return (
            <Box
                sx={{
                    position: 'relative',
                    minHeight: { xs: 'auto', md: minHeight },
                    overflow: 'hidden',
                }}
            >
                {backgroundLayer}

                {showDecorations && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 2,
                            pointerEvents: 'none',
                        }}
                    >
                        <ScatteredStars color={decorationColor} />
                    </Box>
                )}

                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'relative',
                        zIndex: 3,
                        py: { xs: 4, md: 8 },
                    }}
                >
                    <Grid
                        container
                        spacing={4}
                        alignItems="center"
                        direction="row"
                    >
                        {columns}
                    </Grid>
                </Container>
            </Box>
        );
    }

    /* ------------------------------------------------------------------ */
    /*  CENTERED LAYOUT (default)                                          */
    /* ------------------------------------------------------------------ */
    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: { xs: '50vh', md: minHeight },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            {backgroundLayer}

            {showDecorations && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 2,
                        pointerEvents: 'none',
                    }}
                >
                    <ScatteredStars color={decorationColor} />
                </Box>
            )}

            <Container
                maxWidth="md"
                sx={{
                    position: 'relative',
                    zIndex: 3,
                    textAlign: 'center',
                    py: { xs: 6, md: 10 },
                    px: { xs: 3, md: 4 },
                }}
            >
                {heading && (
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            color: textColor,
                            fontWeight: 700,
                            mb: 2,
                            fontSize: {
                                xs: '2rem',
                                sm: '2.75rem',
                                md: '3.5rem',
                            },
                            lineHeight: 1.2,
                        }}
                    >
                        {heading}
                    </Typography>
                )}

                {/* Subtitle is pre-sanitized server-side rich text */}
                {subtitle && (
                    <Box
                        component="div"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(subtitle) }}
                        sx={{
                            color: textColor,
                            opacity: 0.9,
                            mb: 4,
                            fontWeight: 300,
                            fontSize: { xs: '1.1rem', md: '1.4rem' },
                            lineHeight: 1.6,
                            maxWidth: 700,
                            mx: 'auto',
                            '& p': { mb: 1 },
                        }}
                    />
                )}

                {ctaButton}

                {showSecondaryCard && (
                    <Box
                        sx={{
                            mt: { xs: 4, md: 6 },
                            mx: 'auto',
                            maxWidth: 460,
                            backgroundColor: 'rgba(245, 240, 232, 0.94)',
                            color: '#2B3D2F',
                            p: { xs: 3, md: 4 },
                            borderRadius: 2,
                            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                            textAlign: 'center',
                            direction: textDirection,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: "'Amiri', serif",
                                fontWeight: 700,
                                color: '#2B3D2F',
                                mb: secondaryBody ? 1.5 : 0,
                            }}
                        >
                            {secondaryHeading}
                        </Typography>
                        {secondaryBody && (
                            // sanitize via sanitizeHtml — DOMPurify-backed.
                            <Box
                                component="div"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(secondaryBody) }}
                                sx={{
                                    fontSize: '1rem',
                                    lineHeight: 1.7,
                                    color: '#3A4A3F',
                                    '& p': { mb: 1 },
                                }}
                            />
                        )}
                        {secondaryCtaText && (
                            <Button
                                {...(secondaryCtaLink && (secondaryCtaLink.startsWith('http')
                                    ? { component: 'a', href: secondaryCtaLink, target: '_blank', rel: 'noopener noreferrer' }
                                    : { component: InertiaLink, href: secondaryCtaLink }))}
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    backgroundColor: '#C9F050',
                                    color: '#1E2A22',
                                    fontWeight: 700,
                                    borderRadius: 999,
                                    px: 3,
                                    boxShadow: 'none',
                                    '&:hover': { backgroundColor: '#B8DC44', boxShadow: 'none' },
                                }}
                            >
                                {secondaryCtaText}
                            </Button>
                        )}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
