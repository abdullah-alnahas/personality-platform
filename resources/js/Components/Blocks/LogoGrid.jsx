import React from 'react';
import { Box, Typography, Grid, Container, Button } from '@mui/material';
import { Link as InertiaLink } from '@inertiajs/react';
import { useLocale } from '@/Hooks/useLocale';

export default function LogoGrid({ block }) {
    const { getTranslatedField, currentLocale } = useLocale();

    const content = block?.content || {};
    const config = block?.config || {};

    const heading = getTranslatedField(content.heading, currentLocale, '');
    const subtitle = getTranslatedField(content.subtitle, currentLocale, '');
    const logos = content.logos || [];
    const ctaText = getTranslatedField(content.cta_text, currentLocale, '');
    const ctaLink = content.cta_link || '';

    const bgColor = config.background_color || '#1E2A22';
    const textColor = config.text_color || '#ffffff';
    const columns = config.columns || 4;
    const logoMaxHeight = config.logo_max_height || 60;
    const grayscale = config.grayscale || false;

    const grayscaleStyles = grayscale
        ? {
              filter: 'grayscale(100%)',
              transition: 'filter 0.3s ease',
              '&:hover': {
                  filter: 'grayscale(0%)',
              },
          }
        : {};

    return (
        <Box
            sx={{
                backgroundColor: bgColor,
                color: textColor,
                py: { xs: 4, md: 6 },
                width: '100%',
            }}
        >
            <Container maxWidth="lg">
                {heading && (
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ color: textColor, fontWeight: 700, mb: 1 }}
                    >
                        {heading}
                    </Typography>
                )}

                {subtitle && (
                    <Typography
                        variant="subtitle1"
                        align="center"
                        sx={{ color: textColor, opacity: 0.85, mb: 4 }}
                    >
                        {subtitle}
                    </Typography>
                )}

                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    alignItems="center"
                >
                    {logos.map((logo, index) => {
                        const alt = getTranslatedField(
                            logo.heading,
                            currentLocale,
                            ''
                        );
                        const imageUrl = logo.image_url || '';
                        const link = logo.link || '';

                        const imgElement = (
                            <Box
                                component="img"
                                src={imageUrl}
                                alt={alt}
                                sx={{
                                    maxHeight: logoMaxHeight,
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    display: 'block',
                                    mx: 'auto',
                                    ...grayscaleStyles,
                                }}
                            />
                        );

                        return (
                            <Grid
                                item
                                xs={6}
                                sm={Math.max(Math.floor(12 / columns), 2)}
                                md={Math.max(Math.floor(12 / columns), 1)}
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {link ? (
                                    <Box
                                        component="a"
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {imgElement}
                                    </Box>
                                ) : (
                                    imgElement
                                )}
                            </Grid>
                        );
                    })}
                </Grid>

                {ctaText && ctaLink && (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button
                            component={InertiaLink}
                            href={ctaLink}
                            variant="contained"
                            sx={{
                                color: bgColor,
                                backgroundColor: textColor,
                                '&:hover': {
                                    backgroundColor: textColor,
                                    opacity: 0.9,
                                },
                            }}
                        >
                            {ctaText}
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
