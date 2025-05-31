import React from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import RichTextEditor from "@/Components/RichTextEditor";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    FormHelperText,
    Divider,
    Switch,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Edit({
    settings,
    groupedSettings,
    activeLanguages: propActiveLanguages,
}) {
    const { props: pageProps } = usePage(); // Use pageProps for consistency
    const defaultLocale = pageProps.locale || "en";
    const activeLanguages = Array.isArray(propActiveLanguages)
        ? propActiveLanguages
        : pageProps.activeLanguages || ["en", "ar", "tr"];
    const initialFormData = {};
    Object.values(settings || {}).forEach((setting) => {
        const key = setting.key;
        const type = setting.type;
        const value = setting.value;
        if (type === "boolean") {
            let boolValue = false;
            if (
                value &&
                typeof value === "object" &&
                value[defaultLocale] !== undefined
            ) {
                boolValue =
                    String(value[defaultLocale]) === "1" ||
                    value[defaultLocale] === true;
            } else if (typeof value === "string") {
                boolValue = value === "1";
            } else if (typeof value === "boolean") {
                boolValue = value;
            }
            initialFormData[key] = boolValue;
        } else if (
            ["text", "textarea", "richtext", "email", "number"].includes(type)
        ) {
            initialFormData[key] = activeLanguages.reduce((acc, lang) => {
                acc[lang] = value?.[lang] ?? "";
                return acc;
            }, {});
        } else {
            initialFormData[key] = activeLanguages.reduce((acc, lang) => {
                acc[lang] = value?.[lang] ?? "";
                return acc;
            }, {});
        }
    });
    initialFormData._method = "PUT";
    const { data, setData, put, processing, errors } = useForm(initialFormData);
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = { ...data };
        Object.values(settings || {}).forEach((setting) => {
            if (setting.type === "boolean") {
                dataToSubmit[setting.key] = {
                    [defaultLocale]: data[setting.key] ? "1" : "0",
                };
            }
        });
        put(route("admin.settings.update"), {
            data: dataToSubmit,
            preserveScroll: true,
        });
    };
    const handleFieldChange = (key, langCode, valueOrEvent, type) => {
        if (type === "boolean") {
            setData(key, valueOrEvent);
        } else if (
            type === "richtext" ||
            (valueOrEvent && typeof valueOrEvent !== "object")
        ) {
            setData(key, { ...data[key], [langCode]: valueOrEvent });
        } else if (valueOrEvent && valueOrEvent.target) {
            setData(key, {
                ...data[key],
                [langCode]: valueOrEvent.target.value,
            });
        }
    };

    const renderField = (setting) => {
        const key = setting.key;
        const type = setting.type;
        const labelBase = setting.key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        switch (type) {
            case "boolean":
                return (
                    <Grid xs={12} key={key} sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!!data[key]}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            key,
                                            null,
                                            e.target.checked,
                                            type,
                                        )
                                    }
                                    name={key}
                                />
                            }
                            label={labelBase}
                        />
                        {errors[key] && (
                            <FormHelperText error>
                                {typeof errors[key] === "object"
                                    ? errors[key][defaultLocale]
                                    : errors[key]}
                            </FormHelperText>
                        )}
                    </Grid>
                );
            case "text":
            case "email":
            case "number":
                return activeLanguages.map((lang) => (
                    <Grid
                        xs={12}
                        md={activeLanguages.length > 1 ? 4 : 12}
                        key={`${key}-${lang}`}
                    >
                        <TextField
                            fullWidth
                            type={
                                type === "email"
                                    ? "email"
                                    : type === "number"
                                      ? "number"
                                      : "text"
                            }
                            id={`${key}-${lang}`}
                            label={`${labelBase} (${lang.toUpperCase()})`}
                            value={data[key]?.[lang] ?? ""}
                            onChange={(e) =>
                                handleFieldChange(key, lang, e, type)
                            }
                            error={!!errors[`${key}.${lang}`]}
                            helperText={errors[`${key}.${lang}`]}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                ));
            case "textarea":
                return activeLanguages.map((lang) => (
                    <Grid
                        xs={12}
                        md={activeLanguages.length > 1 ? 4 : 12}
                        key={`${key}-${lang}`}
                    >
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            id={`${key}-${lang}`}
                            label={`${labelBase} (${lang.toUpperCase()})`}
                            value={data[key]?.[lang] ?? ""}
                            onChange={(e) =>
                                handleFieldChange(key, lang, e, type)
                            }
                            error={!!errors[`${key}.${lang}`]}
                            helperText={errors[`${key}.${lang}`]}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                ));
            case "richtext":
                return activeLanguages.map((lang) => (
                    <Grid
                        xs={12}
                        md={activeLanguages.length > 1 ? 4 : 12}
                        key={`${key}-${lang}`}
                    >
                        <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                        >{`${labelBase} (${lang.toUpperCase()})`}</Typography>
                        <RichTextEditor
                            value={data[key]?.[lang] || ""}
                            onChange={(value) =>
                                handleFieldChange(key, lang, value, type)
                            }
                            placeholder={`Enter content for ${labelBase} (${lang.toUpperCase()})...`}
                            direction={lang === "ar" ? "rtl" : "ltr"}
                            error={!!errors[`${key}.${lang}`]}
                            helperText={errors[`${key}.${lang}`]}
                        />
                        <Box mb={2} />
                    </Grid>
                ));
            default:
                return (
                    <Grid xs={12} key={key}>
                        <Typography color="error">
                            Unknown setting type: {type} for key: {key}
                        </Typography>
                    </Grid>
                );
        }
    };

    return (
        <>
            <Head title="Site Settings" />
            <Typography variant="h4" gutterBottom>
                {" "}
                Site Settings{" "}
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
            >
                {Object.entries(groupedSettings).map(
                    ([groupName, settingsInGroup]) => (
                        <Accordion
                            defaultExpanded
                            key={groupName}
                            sx={{ mb: 2 }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`${groupName}-content`}
                                id={`${groupName}-header`}
                            >
                                <Typography variant="h6">
                                    {groupName.charAt(0).toUpperCase() +
                                        groupName.slice(1)}{" "}
                                    Settings
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Paper
                                    sx={{
                                        p: 3,
                                        width: "100%",
                                        boxShadow: "none",
                                        border: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        {settingsInGroup.map((setting) =>
                                            renderField(setting),
                                        )}
                                    </Grid>
                                </Paper>
                            </AccordionDetails>
                        </Accordion>
                    ),
                )}
                <Grid
                    xs={12}
                    sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                    >
                        {processing ? "Saving..." : "Save All Settings"}
                    </Button>
                </Grid>
            </Box>
        </>
    );
}
Edit.layout = (page) => <AdminLayout children={page} title="Site Settings" />;
