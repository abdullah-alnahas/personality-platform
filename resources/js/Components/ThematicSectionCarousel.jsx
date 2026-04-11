import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
    Box,
    Typography,
    IconButton,
    useTheme,
} from "@mui/material";
import ContentCard from "@/Components/ContentCard";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function ThematicSectionCarousel({
    title,
    items = [],
    sectionQuote = null,
}) {
    const theme = useTheme();
    const isRtl = theme.direction === "rtl";

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: items.length > 1, direction: isRtl ? "rtl" : "ltr" },
        [Autoplay({ delay: 5000, stopOnInteraction: false })]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const onInit = () => setScrollSnaps(emblaApi.scrollSnapList());
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

        emblaApi.on("init", onInit);
        emblaApi.on("reInit", onInit);
        emblaApi.on("select", onSelect);
        onInit();
        onSelect();

        return () => {
            emblaApi.off("init", onInit);
            emblaApi.off("reInit", onInit);
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    if (!items || items.length === 0) return null;

    const stopAutoplay = () => emblaApi?.plugins()?.autoplay?.stop();
    const startAutoplay = () => emblaApi?.plugins()?.autoplay?.play();

    return (
        <Box sx={{ my: 4, py: 2 }}>
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

            <Box sx={{ position: "relative", px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Viewport */}
                <Box
                    ref={emblaRef}
                    sx={{ overflow: "hidden" }}
                    onMouseEnter={stopAutoplay}
                    onMouseLeave={startAutoplay}
                >
                    <Box sx={{ display: "flex" }}>
                        {items.map((item) => (
                            <Box
                                key={item.id || item.slug}
                                sx={{
                                    /* Responsive slide width via CSS flex basis */
                                    flex: {
                                        xs: "0 0 100%",
                                        sm: "0 0 50%",
                                        md: "0 0 33.333%",
                                        lg: "0 0 25%",
                                    },
                                    minWidth: 0,
                                    px: 1.5,
                                }}
                            >
                                <ContentCard item={item} />
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Previous arrow */}
                <IconButton
                    onClick={scrollPrev}
                    aria-label="Previous slide"
                    size="medium"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: { xs: -10, sm: -15, md: -25 },
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        color: "primary.main",
                        backgroundColor: "background.paper",
                        opacity: 0.85,
                        boxShadow: 2,
                        "&:hover": { opacity: 1 },
                    }}
                >
                    <ArrowBackIosNewIcon fontSize="inherit" />
                </IconButton>

                {/* Next arrow */}
                <IconButton
                    onClick={scrollNext}
                    aria-label="Next slide"
                    size="medium"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        right: { xs: -10, sm: -15, md: -25 },
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        color: "primary.main",
                        backgroundColor: "background.paper",
                        opacity: 0.85,
                        boxShadow: 2,
                        "&:hover": { opacity: 1 },
                    }}
                >
                    <ArrowForwardIosIcon fontSize="inherit" />
                </IconButton>
            </Box>

            {/* Dot indicators */}
            {scrollSnaps.length > 1 && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        mt: 2,
                    }}
                >
                    {scrollSnaps.map((_, index) => (
                        <Box
                            key={index}
                            component="button"
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                border: "none",
                                cursor: "pointer",
                                p: 0,
                                backgroundColor:
                                    index === selectedIndex
                                        ? "primary.main"
                                        : "grey.400",
                                transition: "background-color 0.2s",
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}
