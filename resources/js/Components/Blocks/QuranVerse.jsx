import React from 'react';
import { Box, Typography, Container, Paper, Button, Chip } from '@mui/material';
import { Link as InertiaLink } from '@inertiajs/react';
import { useLocale } from '@/Hooks/useLocale';
import OrnamentalDivider from '@/Components/Decorative/OrnamentalDivider';

const QURAN_FONT_FAMILY = "'KFGQPC Hafs Uthmanic Script', 'Amiri', 'Traditional Arabic', serif";
const SECONDARY_FONT_FAMILY = "'Amiri', 'Traditional Arabic', serif";
const BISMILLAH = '\uFDFD';

function SectionHeading({ text, color }) {
    if (!text) return null;
    return (
        <Typography
            variant="h3"
            sx={{
                color,
                fontFamily: SECONDARY_FONT_FAMILY,
                fontWeight: 700,
                textAlign: 'center',
                mb: 4,
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                direction: 'rtl',
            }}
        >
            {text}
        </Typography>
    );
}

function BismillahText({ color }) {
    return (
        <Typography
            sx={{
                color,
                fontFamily: QURAN_FONT_FAMILY,
                fontSize: { xs: '2rem', md: '2.8rem' },
                textAlign: 'center',
                direction: 'rtl',
                mb: 1,
            }}
        >
            {BISMILLAH}
        </Typography>
    );
}

function VerseText({ text, color }) {
    if (!text) return null;
    return (
        <Typography
            sx={{
                color,
                fontFamily: QURAN_FONT_FAMILY,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                lineHeight: 2.2,
                textAlign: 'center',
                direction: 'rtl',
                px: { xs: 1, md: 4 },
            }}
        >
            {text}
        </Typography>
    );
}

function VerseReference({ surahName, verseReference, color }) {
    if (!surahName) return null;
    return (
        <Typography
            sx={{
                color,
                fontFamily: QURAN_FONT_FAMILY,
                fontSize: '1.1rem',
                textAlign: 'center',
                direction: 'rtl',
                mt: 1,
                opacity: 0.85,
            }}
        >
            {surahName}
            {verseReference ? ` — ${verseReference}` : ''}
        </Typography>
    );
}

function SecondaryContent({ text, source, color }) {
    if (!text) return null;
    return (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography
                sx={{
                    color,
                    fontFamily: SECONDARY_FONT_FAMILY,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    lineHeight: 2,
                    direction: 'rtl',
                    opacity: 0.9,
                    px: { xs: 1, md: 4 },
                }}
            >
                {text}
            </Typography>
            {source && (
                <Typography
                    sx={{
                        color,
                        fontSize: '0.9rem',
                        mt: 1,
                        opacity: 0.7,
                        direction: 'rtl',
                    }}
                >
                    {source}
                </Typography>
            )}
        </Box>
    );
}

function CtaButton({ text, link, accentColor }) {
    if (!text || !link) return null;
    return (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
                component={InertiaLink}
                href={link}
                variant="contained"
                sx={{
                    backgroundColor: accentColor,
                    color: '#1a237e',
                    fontWeight: 700,
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    fontSize: '1rem',
                    '&:hover': {
                        backgroundColor: accentColor,
                        opacity: 0.9,
                    },
                }}
            >
                {text}
            </Button>
        </Box>
    );
}

function BottomItems({ items, getTranslatedField, currentLocale, accentColor }) {
    if (!items || items.length === 0) return null;
    return (
        <Box
            sx={{
                mt: 4,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1.5,
            }}
        >
            {items.map((item, index) => {
                const label = getTranslatedField(item.heading, currentLocale, '');
                if (!label) return null;
                return (
                    <Chip
                        key={index}
                        label={label}
                        icon={
                            item.image_url ? (
                                <Box
                                    component="img"
                                    src={item.image_url}
                                    alt=""
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : undefined
                        }
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: '#fff',
                            fontFamily: SECONDARY_FONT_FAMILY,
                            fontSize: '0.9rem',
                            borderRadius: 20,
                            px: 1,
                            py: 2.5,
                            border: `1px solid ${accentColor}40`,
                            '& .MuiChip-icon': {
                                ml: 0.5,
                                mr: -0.5,
                            },
                        }}
                    />
                );
            })}
        </Box>
    );
}

function OverlayLayout({
    content,
    config,
    getTranslatedField,
    currentLocale,
}) {
    const textColor = config.text_color || '#ffffff';
    const accentColor = config.accent_color || '#C9A94E';
    const showFrame = config.ornamental_frame !== false;

    const verseText = getTranslatedField(content.verse_text, currentLocale, '');
    const surahName = getTranslatedField(content.surah_name, currentLocale, '');
    const sectionHeading = getTranslatedField(content.section_heading, currentLocale, '');
    const secondaryText = getTranslatedField(content.secondary_text, currentLocale, '');
    const secondarySource = getTranslatedField(content.secondary_source, currentLocale, '');
    const ctaText = getTranslatedField(content.cta_text, currentLocale, '');

    return (
        <Box sx={{ textAlign: 'center' }}>
            <SectionHeading text={sectionHeading} color={accentColor} />
            <BismillahText color={accentColor} />
            {showFrame && <OrnamentalDivider color={accentColor} />}
            <Box sx={{ my: 3 }}>
                <VerseText text={verseText} color={textColor} />
            </Box>
            {showFrame && <OrnamentalDivider color={accentColor} />}
            <VerseReference
                surahName={surahName}
                verseReference={content.verse_reference}
                color={textColor}
            />
            <SecondaryContent
                text={secondaryText}
                source={secondarySource}
                color={textColor}
            />
            <CtaButton
                text={ctaText}
                link={content.cta_link}
                accentColor={accentColor}
            />
            <BottomItems
                items={content.bottom_items}
                getTranslatedField={getTranslatedField}
                currentLocale={currentLocale}
                accentColor={accentColor}
            />
        </Box>
    );
}

function CardLayout({
    content,
    config,
    getTranslatedField,
    currentLocale,
}) {
    const textColor = config.text_color || '#ffffff';
    const accentColor = config.accent_color || '#C9A94E';
    const showFrame = config.ornamental_frame !== false;

    const verseText = getTranslatedField(content.verse_text, currentLocale, '');
    const surahName = getTranslatedField(content.surah_name, currentLocale, '');
    const sectionHeading = getTranslatedField(content.section_heading, currentLocale, '');
    const secondaryText = getTranslatedField(content.secondary_text, currentLocale, '');
    const secondarySource = getTranslatedField(content.secondary_source, currentLocale, '');
    const ctaText = getTranslatedField(content.cta_text, currentLocale, '');

    return (
        <Box sx={{ textAlign: 'center' }}>
            <SectionHeading text={sectionHeading} color={accentColor} />
            <Paper
                elevation={6}
                sx={{
                    backgroundColor: 'rgba(255, 253, 245, 0.97)',
                    borderRadius: 3,
                    px: { xs: 3, md: 6 },
                    py: { xs: 4, md: 5 },
                    mx: 'auto',
                    maxWidth: 800,
                    border: `1px solid ${accentColor}30`,
                }}
            >
                <BismillahText color={accentColor} />
                {showFrame && <OrnamentalDivider color={accentColor} />}
                <Box sx={{ my: 3 }}>
                    <VerseText text={verseText} color="#1a237e" />
                </Box>
                {showFrame && <OrnamentalDivider color={accentColor} />}
                <VerseReference
                    surahName={surahName}
                    verseReference={content.verse_reference}
                    color="#37474f"
                />
            </Paper>
            <SecondaryContent
                text={secondaryText}
                source={secondarySource}
                color={textColor}
            />
            <BottomItems
                items={content.bottom_items}
                getTranslatedField={getTranslatedField}
                currentLocale={currentLocale}
                accentColor={accentColor}
            />
            <CtaButton
                text={ctaText}
                link={content.cta_link}
                accentColor={accentColor}
            />
        </Box>
    );
}

export default function QuranVerse({ block }) {
    const { getTranslatedField, currentLocale } = useLocale();

    const content = block?.content || {};
    const config = block?.config || {};

    const layout = config.layout || 'overlay';
    const bgColor = config.background_color || '#1a237e';
    const paddingY = config.padding_y || '4rem';
    const bgImage = content.background_image_url;

    const LayoutComponent = layout === 'card' ? CardLayout : OverlayLayout;

    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                py: paddingY,
                backgroundColor: bgColor,
                backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
            }}
        >
            {bgImage && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: `${bgColor}E6`,
                        zIndex: 0,
                    }}
                />
            )}
            <Container
                maxWidth="md"
                sx={{ position: 'relative', zIndex: 1 }}
            >
                <LayoutComponent
                    content={content}
                    config={config}
                    getTranslatedField={getTranslatedField}
                    currentLocale={currentLocale}
                />
            </Container>
        </Box>
    );
}
