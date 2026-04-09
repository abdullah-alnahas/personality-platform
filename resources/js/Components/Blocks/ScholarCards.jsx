/**
 * ScholarCards block — renders scholars grouped by region/country.
 * Uses dangerouslySetInnerHTML intentionally for pre-sanitized rich text
 * (description field comes from the admin rich-text editor).
 */
import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Tabs,
    Tab,
} from "@mui/material";
import { useLocale } from "@/Hooks/useLocale";

const ScholarCards = ({ block }) => {
    const { currentLocale } = useLocale();
    const content = block.content || {};
    const config = block.config || {};
    const groups = block.resolved_data || [];
    const [activeTab, setActiveTab] = useState(0);

    const t = (field) => {
        if (!field) return "";
        if (typeof field === "string") return field;
        return (
            field[currentLocale] ||
            field.ar ||
            field.en ||
            Object.values(field)[0] ||
            ""
        );
    };

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
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                )}

                {groups.length === 0 ? (
                    <Typography align="center" sx={{ opacity: 0.5, py: 4 }}>
                        No scholars found.
                    </Typography>
                ) : groups.length === 1 ? (
                    <SingleGroupList
                        group={groups[0]}
                        t={t}
                        cardBg={cardBg}
                        textColor={textColor}
                        accentColor={accentColor}
                    />
                ) : (
                    <TabbedGroups
                        groups={groups}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
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
            {group.scholars.map((s) => (
                <Grid item xs={12} sm={6} md={4} key={s.id}>
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
}) => (
    <>
        <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            centered
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
                            {group.scholars.map((s) => (
                                <Grid item xs={12} sm={6} md={4} key={s.id}>
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

export default ScholarCards;
