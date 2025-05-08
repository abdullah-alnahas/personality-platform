import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import ContentCard from '@/Components/ContentCard'; // Assuming ContentCard can be used or adapted
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Custom Arrow components for react-slick
function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <IconButton
            className={className}
            sx={{
                ...style, display: 'block', color: 'primary.main', right: -25, zIndex: 2,
                '&:hover': { bgcolor: 'action.hover' }
            }}
            onClick={onClick}
            size="large"
        >
            <ArrowForwardIosIcon />
        </IconButton>
    );
}

function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <IconButton
            className={className}
            sx={{
                ...style, display: 'block', color: 'primary.main', left: -25, zIndex: 2,
                '&:hover': { bgcolor: 'action.hover' }
            }}
            onClick={onClick}
            size="large"
        >
            <ArrowBackIosNewIcon />
        </IconButton>
    );
}


export default function ThematicSectionCarousel({ title, items = [], sectionQuote = null }) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));

    if (!items || items.length === 0) {
        return null; // Don't render if no items
    }

    const settings = {
        dots: true,
        infinite: items.length > (isSm ? 1 : (isMd ? 2 : 3)), // Only infinite if more items than slides
        speed: 500,
        slidesToShow: isXs ? 1 : (isSm ? 1 : (isMd ? 2 : 3)), // Adjust based on screen size
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000, // 5 seconds
        pauseOnHover: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        rtl: theme.direction === 'rtl', // Support RTL
        // Responsive settings for more granular control
        responsive: [
            {
                breakpoint: 1200, // lg
                settings: { slidesToShow: 3, slidesToScroll: 1, infinite: items.length > 3 }
            },
            {
                breakpoint: 900, // md
                settings: { slidesToShow: 2, slidesToScroll: 1, infinite: items.length > 2 }
            },
            {
                breakpoint: 600, // sm
                settings: { slidesToShow: 1, slidesToScroll: 1, infinite: items.length > 1 }
            }
        ]
    };

    return (
        <Box sx={{ my: 4, py: 2, px: { xs: 0, sm: 2 } }}> {/* Add some padding for arrows */}
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 1 }}>
                {title}
            </Typography>
            {sectionQuote && (
                <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center', mb: 3, fontStyle: 'italic', maxWidth: '700px', mx: 'auto' }}>
                    "{sectionQuote}"
                </Typography>
            )}
            <Slider {...settings}>
                {items.map((item) => (
                    <Box key={item.id || item.title} sx={{ px: 1.5, height: '100%' }}> {/* Padding between cards */}
                        {/* Using ContentCard. Ensure it's styled to fit well in a carousel. */}
                        {/* You might need a simpler card structure for carousels if ContentCard is too complex */}
                        <ContentCard item={item} />
                    </Box>
                ))}
            </Slider>
        </Box>
    );
}
