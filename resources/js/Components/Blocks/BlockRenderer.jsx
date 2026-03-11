import React from "react";
import { Box, Typography, Container } from "@mui/material";
import HeroBanner from "@/Components/Blocks/HeroBanner";
import TextWithImage from "@/Components/Blocks/TextWithImage";
import PillarCards from "@/Components/Blocks/PillarCards";
import QuranVerse from "@/Components/Blocks/QuranVerse";
import CategoryGrid from "@/Components/Blocks/CategoryGrid";
import LatestNews from "@/Components/Blocks/LatestNews";
import FeaturedQuote from "@/Components/Blocks/FeaturedQuote";
import SocialMediaFeed from "@/Components/Blocks/SocialMediaFeed";
import NewsletterCta from "@/Components/Blocks/NewsletterCta";
import RichTextBlock from "@/Components/Blocks/RichTextBlock";
import Spacer from "@/Components/Blocks/Spacer";
import LogoGrid from "@/Components/Blocks/LogoGrid";

const blockComponents = {
    hero_banner: HeroBanner,
    text_with_image: TextWithImage,
    pillar_cards: PillarCards,
    quran_verse: QuranVerse,
    category_grid: CategoryGrid,
    latest_news: LatestNews,
    featured_quote: FeaturedQuote,
    social_media_feed: SocialMediaFeed,
    newsletter_cta: NewsletterCta,
    rich_text: RichTextBlock,
    spacer: Spacer,
    logo_grid: LogoGrid,
};

export default function BlockRenderer({ block }) {
    if (!block) return null;

    const config = block.config || {};
    const BlockComponent = blockComponents[block.block_type];

    if (!BlockComponent) {
        return (
            <Container maxWidth="lg" sx={{ py: 2 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    Unknown block type: {block.block_type}
                </Typography>
            </Container>
        );
    }

    const isFullWidth =
        config.full_width ||
        block.block_type === "hero_banner" ||
        block.block_type === "quran_verse" ||
        block.block_type === "newsletter_cta" ||
        block.block_type === "featured_quote" ||
        block.block_type === "logo_grid";

    return (
        <Box
            className={config.css_class || undefined}
            sx={{
                backgroundColor: config.background_color || "transparent",
                py: { none: 0, sm: 2, md: 4, lg: 6, xl: 8 }[config.padding_y] ?? 4,
                width: "100%",
            }}
        >
            {isFullWidth ? (
                <BlockComponent block={block} />
            ) : (
                <Container maxWidth="lg">
                    <BlockComponent block={block} />
                </Container>
            )}
        </Box>
    );
}
