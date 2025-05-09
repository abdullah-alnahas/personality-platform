import React from "react";
import Slider from "react-slick";
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import ContentCard from "@/Components/ContentCard"; // Assuming ContentCard will be used for items
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Custom Arrow components for react-slick to integrate with MUI
function NextArrow(props) {
    const { className, style, onClick } = props;
    const theme = useTheme();
    return (
        <IconButton
            className={className}
            sx={{
                ...style,
                display: "block",
                color: theme.palette.primary.main, // Use theme color
                backgroundColor: theme.palette.background.paper + "aa", // Semi-transparent background
                "&:hover": {
                    backgroundColor: theme.palette.background.paper, // Solid on hover
                },
                position: "absolute",
                top: "50%",
                right: { xs: -10, sm: -15, md: -25 }, // Adjust position
                transform: "translateY(-50%)",
                zIndex: 2,
                boxShadow: theme.shadows[2],
            }}
            onClick={onClick}
            size="medium" // Adjust size as needed
        >
            <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
    );
}

function PrevArrow(props) {
    const { className, style, onClick } = props;
    const theme = useTheme();
    return (
        <IconButton
            className={className}
            sx={{
                ...style,
                display: "block",
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.background.paper + "aa",
                "&:hover": {
                    backgroundColor: theme.palette.background.paper,
                },
                position: "absolute",
                top: "50%",
                left: { xs: -10, sm: -15, md: -25 }, // Adjust position
                transform: "translateY(-50%)",
                zIndex: 2,
                boxShadow: theme.shadows[2],
            }}
            onClick={onClick}
            size="medium"
        >
            <ArrowBackIosNewIcon fontSize="inherit" />
        </IconButton>
    );
}

export default function ThematicSectionCarousel({
    title,
    items = [],
    sectionQuote = null,
}) {
    const theme = useTheme();
    // Breakpoints for responsive settings
    const isXs = useMediaQuery(theme.breakpoints.down("xs")); // Extra small, less than 600px
    const isSm = useMediaQuery(theme.breakpoints.between("sm", "md")); // Small, 600px - 900px
    const isMd = useMediaQuery(theme.breakpoints.between("md", "lg")); // Medium, 900px - 1200px
    const isLg = useMediaQuery(theme.breakpoints.up("lg")); // Large, 1200px and up

    if (!items || items.length === 0) {
        return null; // Don't render if no items
    }

    // Determine number of slides to show based on current active breakpoint
    let slidesToShow = 1;
    if (isLg)
        slidesToShow = 4; // Large screens
    else if (isMd)
        slidesToShow = 3; // Medium screens
    else if (isSm) slidesToShow = 2; // Small screens
    // isXs remains 1 slide

    const settings = {
        dots: true,
        infinite: items.length > slidesToShow, // Only infinite if more items than slides displayed
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1, // Scroll one item at a time
        autoplay: true,
        autoplaySpeed: 5000, // 5 seconds
        pauseOnHover: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        rtl: theme.direction === "rtl", // Support RTL based on MUI theme
        responsive: [
            // More granular control for react-slick's own breakpoints
            {
                breakpoint: 1536, // Corresponds to MUI 'xl'
                settings: {
                    slidesToShow: Math.min(items.length, 4),
                    infinite: items.length > 4,
                },
            },
            {
                breakpoint: 1200, // Corresponds to MUI 'lg'
                settings: {
                    slidesToShow: Math.min(items.length, 3),
                    infinite: items.length > 3,
                },
            },
            {
                breakpoint: 900, // Corresponds to MUI 'md'
                settings: {
                    slidesToShow: Math.min(items.length, 2),
                    infinite: items.length > 2,
                },
            },
            {
                breakpoint: 600, // Corresponds to MUI 'sm'
                settings: {
                    slidesToShow: Math.min(items.length, 1),
                    infinite: items.length > 1,
                },
            },
        ],
    };

    return (
        <Box sx={{ my: 4, py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
            {" "}
            {/* Add horizontal padding for arrows */}
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ textAlign: "center", mb: 1 }}
            >
                {title}
            </Typography>
            {sectionQuote && (
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{
                        textAlign: "center",
                        mb: 3,
                        fontStyle: "italic",
                        maxWidth: "700px",
                        mx: "auto",
                    }}
                >
                    "{sectionQuote}"
                </Typography>
            )}
            {/* Add a check for items length to avoid errors with slider if not enough items */}
            {items.length > 0 ? (
                <Slider {...settings}>
                    {items.map((item) => (
                        <Box
                            key={item.id || item.slug}
                            sx={{
                                px: 1.5,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {" "}
                            {/* Padding between cards */}
                            <ContentCard item={item} />
                        </Box>
                    ))}
                </Slider>
            ) : (
                <Typography sx={{ textAlign: "center", mt: 2 }}>
                    No items to display in this section.
                </Typography>
            )}
        </Box>
    );
}
