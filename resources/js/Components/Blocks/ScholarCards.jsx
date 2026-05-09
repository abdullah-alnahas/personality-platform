/**
 * ScholarCards block — renders scholars grouped by region/country.
 * Uses dangerouslySetInnerHTML intentionally for pre-sanitized rich text
 * (description field comes from the admin rich-text editor).
 */
import React, { useRef, useState } from "react";
import { sanitizeHtml } from "@/utils/sanitize";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Tabs,
    Tab,
    IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocale } from "@/Hooks/useLocale";

const ScholarCards = ({ block }) => {
    const { currentLocale, isRTL, getTranslatedField: t } = useLocale();
    const content = block?.content || {};
    const config = block?.config || {};
    const groups = block?.resolved_data || [];
    const [activeTab, setActiveTab] = useState(0);
    const noScholarsLabel = currentLocale === 'ar' ? 'لا يوجد علماء.' : currentLocale === 'tr' ? 'Alim bulunamadı.' : 'No scholars found.';

    const bgColor = config.background_color || "#F5F0E8";
    const textColor = config.text_color || "#2B3D2F";
    const accentColor = config.accent_color || "#2B3D2F";
    const isLight =
        bgColor === "#F5F0E8" ||
        bgColor.toLowerCase().startsWith("#f") ||
        bgColor.toLowerCase().startsWith("#e");

    const cardBg = isLight
        ? "rgba(43,61,47,0.06)"
        : "rgba(255,255,255,0.06)";

    const description = t(content.description);

    return (
        <Box
            component="section"
            sx={{
                backgroundColor: bgColor,
                color: textColor,
                py: config.padding_y === "xl" ? 10 : 7,
            }}
        >
            <Container maxWidth="lg">
                {content.heading && (
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{
                            fontFamily: "'Amiri', serif",
                            fontWeight: 700,
                            color: accentColor,
                            mb: 1,
                            direction: isRTL ? 'rtl' : 'ltr',
                        }}
                    >
                        {t(content.heading)}
                    </Typography>
                )}

                {description && (
                    <Typography
                        variant="body1"
                        align="center"
                        component="div"
                        sx={{
                            maxWidth: 700,
                            mx: "auto",
                            mb: 5,
                            opacity: 0.85,
                            fontFamily: "'Tajawal', sans-serif",
                            lineHeight: 1.8,
                        }}
                        /* pre-sanitized by TipTap / admin rich-text editor */
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
                    />
                )}

                {groups.length === 0 ? (
                    <Typography align="center" sx={{ opacity: 0.5, py: 4 }}>
                        {noScholarsLabel}
                    </Typography>
                ) : groups.length === 1 ? (
                    <SingleGroupList
                        group={groups[0]}
                        t={t}
                        cardBg={cardBg}
                        textColor={textColor}
                        accentColor={accentColor}
                    />
                ) : (config.layout || 'columns') === 'tabs' ? (
                    <TabbedGroups
                        groups={groups}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        t={t}
                        cardBg={cardBg}
                        textColor={textColor}
                        accentColor={accentColor}
                        isRTL={isRTL}
                    />
                ) : (config.layout === 'carousel') ? (
                    <CarouselGroups
                        groups={groups}
                        t={t}
                        cardBg={cardBg}
                        textColor={textColor}
                        accentColor={accentColor}
                        isRTL={isRTL}
                    />
                ) : (
                    <ColumnGroups
                        groups={groups}
                        t={t}
                        cardBg={cardBg}
                        textColor={textColor}
                        accentColor={accentColor}
                    />
                )}
            </Container>
        </Box>
    );
};

const SingleGroupList = ({ group, t, cardBg, textColor, accentColor }) => (
    <Paper
        elevation={0}
        sx={{ backgroundColor: cardBg, borderRadius: 3, p: 3 }}
    >
        <Grid container spacing={2}>
            {(group.scholars || []).map((s) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.id}>
                    <Typography
                        sx={{
                            fontFamily: "'Amiri', serif",
                            fontSize: "1rem",
                            color: textColor,
                            py: 0.5,
                            borderBottom: `1px solid ${accentColor}22`,
                        }}
                    >
                        {t(s.name)}
                    </Typography>
                    {t(s.bio) && (
                        <Typography
                            variant="caption"
                            display="block"
                            sx={{
                                fontFamily: "'Tajawal', sans-serif",
                                opacity: 0.65,
                                mt: 0.25,
                            }}
                        >
                            {t(s.bio)}
                        </Typography>
                    )}
                </Grid>
            ))}
        </Grid>
    </Paper>
);

const TabbedGroups = ({
    groups,
    activeTab,
    setActiveTab,
    t,
    cardBg,
    textColor,
    accentColor,
    isRTL,
}) => (
    <>
        <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            centered
            dir={isRTL ? "rtl" : "ltr"}
            sx={{
                mb: 4,
                "& .MuiTab-root": {
                    fontFamily: "'Amiri', serif",
                    fontSize: "1.1rem",
                    color: textColor,
                    opacity: 0.7,
                },
                "& .Mui-selected": {
                    color: `${accentColor} !important`,
                    opacity: 1,
                },
                "& .MuiTabs-indicator": {
                    backgroundColor: accentColor,
                },
            }}
        >
            {groups.map((group, idx) => (
                <Tab
                    key={group.group_key}
                    label={t(group.group_name)}
                    id={`scholar-tab-${idx}`}
                    aria-controls={`scholar-panel-${idx}`}
                />
            ))}
        </Tabs>

        {groups.map((group, idx) => (
            <Box
                key={group.group_key}
                role="tabpanel"
                id={`scholar-panel-${idx}`}
                aria-labelledby={`scholar-tab-${idx}`}
                hidden={activeTab !== idx}
            >
                {activeTab === idx && (
                    <Paper
                        elevation={0}
                        sx={{ backgroundColor: cardBg, borderRadius: 3, p: 3 }}
                    >
                        <Grid container spacing={2}>
                            {(group.scholars || []).map((s) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.id}>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Amiri', serif",
                                            fontSize: "1rem",
                                            color: textColor,
                                            py: 0.5,
                                            borderBottom: `1px solid ${accentColor}22`,
                                        }}
                                    >
                                        {t(s.name)}
                                    </Typography>
                                    {t(s.bio) && (
                                        <Typography
                                            variant="caption"
                                            display="block"
                                            sx={{
                                                fontFamily: "'Tajawal', sans-serif",
                                                opacity: 0.65,
                                                mt: 0.25,
                                            }}
                                        >
                                            {t(s.bio)}
                                        </Typography>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}
            </Box>
        ))}
    </>
);

const ColumnGroups = ({ groups, t, cardBg, textColor, accentColor }) => (
    <Grid container spacing={3} alignItems="stretch">
        {groups.map((group) => (
            <Grid
                size={{ xs: 12, md: groups.length >= 3 ? 4 : 6 }}
                key={group.group_key}
            >
                <Paper
                    elevation={0}
                    sx={{
                        backgroundColor: cardBg,
                        borderRadius: 3,
                        p: { xs: 3, md: 4 },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{
                            fontFamily: "'Amiri', serif",
                            fontWeight: 700,
                            color: accentColor,
                            mb: 3,
                            pb: 2,
                            borderBottom: `2px solid ${accentColor}33`,
                        }}
                    >
                        {t(group.group_name)}
                    </Typography>
                    <Box
                        component="ul"
                        sx={{
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        {(group.scholars || []).map((s) => (
                            <Box
                                component="li"
                                key={s.id}
                                sx={{
                                    fontFamily: "'Amiri', serif",
                                    fontSize: '1rem',
                                    color: textColor,
                                    py: 0.75,
                                    borderBottom: `1px solid ${accentColor}1A`,
                                    '&:last-child': { borderBottom: 'none' },
                                }}
                            >
                                {t(s.name)}
                                {t(s.bio) && (
                                    <Typography
                                        variant="caption"
                                        display="block"
                                        sx={{
                                            fontFamily: "'Tajawal', sans-serif",
                                            opacity: 0.65,
                                            mt: 0.25,
                                        }}
                                    >
                                        {t(s.bio)}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Grid>
        ))}
    </Grid>
);

const CarouselGroups = ({ groups, t, cardBg, textColor, accentColor, isRTL }) => {
    const scrollerRef = useRef(null);
    const scrollBy = (direction) => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: el.clientWidth * 0.8 * direction, behavior: "smooth" });
    };
    return (
        <Box sx={{ position: "relative" }}>
            <IconButton
                aria-label="previous"
                onClick={() => scrollBy(isRTL ? 1 : -1)}
                sx={{
                    position: "absolute",
                    top: "50%",
                    insetInlineStart: -16,
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    backgroundColor: `${accentColor}22`,
                    color: textColor,
                    "&:hover": { backgroundColor: `${accentColor}44` },
                }}
            >
                {isRTL ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            <IconButton
                aria-label="next"
                onClick={() => scrollBy(isRTL ? -1 : 1)}
                sx={{
                    position: "absolute",
                    top: "50%",
                    insetInlineEnd: -16,
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    backgroundColor: `${accentColor}22`,
                    color: textColor,
                    "&:hover": { backgroundColor: `${accentColor}44` },
                }}
            >
                {isRTL ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <Box
                ref={scrollerRef}
                sx={{
                    display: "flex",
                    gap: 3,
                    overflowX: "auto",
                    overflowY: "hidden",
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    py: 1,
                }}
            >
                {groups.map((group) => (
                    <Box
                        key={group.group_key}
                        sx={{
                            flex: "0 0 auto",
                            width: { xs: "85%", sm: "60%", md: "32%" },
                            scrollSnapAlign: "start",
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor: cardBg,
                                borderRadius: 3,
                                p: { xs: 3, md: 4 },
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                variant="h5"
                                align="center"
                                sx={{
                                    fontFamily: "'Amiri', serif",
                                    fontWeight: 700,
                                    color: accentColor,
                                    mb: 3,
                                    pb: 2,
                                    borderBottom: `2px solid ${accentColor}33`,
                                }}
                            >
                                {t(group.group_name)}
                            </Typography>
                            <Box
                                component="ul"
                                sx={{
                                    listStyle: "none",
                                    p: 0,
                                    m: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                {(group.scholars || []).map((s) => (
                                    <Box
                                        component="li"
                                        key={s.id}
                                        sx={{
                                            fontFamily: "'Amiri', serif",
                                            fontSize: "1rem",
                                            color: textColor,
                                            py: 0.75,
                                            borderBottom: `1px solid ${accentColor}1A`,
                                            "&:last-child": { borderBottom: "none" },
                                        }}
                                    >
                                        {t(s.name)}
                                        {t(s.bio) && (
                                            <Typography
                                                variant="caption"
                                                display="block"
                                                sx={{
                                                    fontFamily: "'Tajawal', sans-serif",
                                                    opacity: 0.65,
                                                    mt: 0.25,
                                                }}
                                            >
                                                {t(s.bio)}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ScholarCards;
