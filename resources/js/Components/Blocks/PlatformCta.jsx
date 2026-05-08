import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link as InertiaLink } from '@inertiajs/react';
import { useLocale } from '@/Hooks/useLocale';
import { sanitizeHtml, safeUrl, safeBackgroundUrl } from '@/utils/sanitize';

/**
 * Platform CTA block — designed for sections like the prototype's
 * "تلقي - المنصة العلمية" panel: large decorative pattern on one side,
 * brand icon + heading + body + CTA on the other.
 */
export default function PlatformCta({ block }) {
    const { getTranslatedField, currentLocale, isRTL } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};

    const heading = getTranslatedField(content.heading, currentLocale);
    const brandName = getTranslatedField(content.brand_name, currentLocale);
    const body = getTranslatedField(content.body, currentLocale);
    const ctaText = getTranslatedField(content.cta_text, currentLocale);
    const ctaLink = content.cta_link || '';
    const iconUrl = content.icon_url || '';
    const patternUrl = safeBackgroundUrl(content.pattern_image_url);

    const bg = config.background_color || '#F5F0E8';
    const fg = config.text_color || '#2B3D2F';
    const accent = config.accent_color || '#6B7B4C';
    const patternPosition = config.pattern_position || 'left';
    const patternOpacity = config.pattern_opacity ?? 0.18;
    const padY = config.padding_y === 'xl' ? 12 : config.padding_y === 'lg' ? 8 : 5;

    const ctaButton = ctaText && (
        <Button
            {...(ctaLink && (/^https?:\/\//i.test(ctaLink)
                ? { component: 'a', href: safeUrl(ctaLink), target: '_blank', rel: 'noopener noreferrer' }
                : { component: InertiaLink, href: safeUrl(ctaLink) }))}
            variant="contained"
            sx={{
                mt: 3,
                backgroundColor: '#C9F050',
                color: '#1E2A22',
                fontWeight: 700,
                borderRadius: 999,
                px: 4,
                py: 1.25,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#B8DC44', boxShadow: 'none' },
            }}
        >
            {ctaText}
        </Button>
    );

    const patternSide = patternPosition === 'right' ? 'right' : 'left';
    const visualPatternSide = isRTL ? (patternSide === 'left' ? 'right' : 'left') : patternSide;

    // sanitizeHtml is backed by isomorphic-dompurify and runs on both client + SSR.
    const safeBody = body ? sanitizeHtml(body) : '';
    const bodyProps = safeBody ? { dangerouslySetInnerHTML: { __html: safeBody } } : {};

    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                backgroundColor: bg,
                color: fg,
                py: padY,
                overflow: 'hidden',
            }}
        >
            {patternUrl && (
                <Box
                    aria-hidden="true"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        [visualPatternSide]: 0,
                        width: { xs: '60%', md: '45%' },
                        backgroundImage: `url(${patternUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: visualPatternSide === 'left' ? 'left center' : 'right center',
                        opacity: patternOpacity,
                        pointerEvents: 'none',
                    }}
                />
            )}

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        maxWidth: 720,
                        mx: 'auto',
                    }}
                >
                    {(iconUrl || brandName) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            {iconUrl && (
                                <Box
                                    component="img"
                                    src={iconUrl}
                                    alt={brandName || ''}
                                    sx={{ height: 56, width: 'auto' }}
                                />
                            )}
                            {brandName && (
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: "'Amiri', serif",
                                        fontWeight: 700,
                                        color: accent,
                                    }}
                                >
                                    {brandName}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {heading && (
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: "'Amiri', serif",
                                fontWeight: 700,
                                color: fg,
                                mb: 2,
                                fontSize: { xs: '1.75rem', md: '2.25rem' },
                            }}
                        >
                            {heading}
                        </Typography>
                    )}

                    {safeBody && (
                        <Box
                            component="div"
                            {...bodyProps}
                            sx={{
                                color: fg,
                                opacity: 0.85,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.8,
                                '& p': { mb: 1.25 },
                            }}
                        />
                    )}

                    {ctaButton}
                </Box>
            </Container>
        </Box>
    );
}
