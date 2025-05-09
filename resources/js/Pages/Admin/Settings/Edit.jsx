import React from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
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

export default function Edit({ settings, groupedSettings, activeLanguages }) {
    const { props } = usePage();
    const defaultLocale = props.locale || "en";

    // Initialize form data dynamically from all settings
    const initialFormData = {};
    Object.values(settings).forEach((setting) => {
        const key = setting.key;
        const type = setting.type;
        const value = setting.value; // This is the JSON object like {en: "val", ar: "val_ar"} or simple for boolean

        if (type === "boolean") {
            // Booleans are expected to be true/false directly from form,
            // but stored as "1"/"0" in the default locale by seeder.
            // Controller's UpdateSettingsRequest handles boolean cast.
            let boolValue = false;
            if (
                value &&
                typeof value === "object" &&
                value[defaultLocale] !== undefined
            ) {
                boolValue =
                    value[defaultLocale] === "1" ||
                    value[defaultLocale] === true;
            } else if (typeof value === "string") {
                // Non-translatable boolean might be stored as direct string
                boolValue = value === "1";
            } else if (typeof value === "boolean") {
                boolValue = value;
            }
            initialFormData[key] = boolValue;
        } else if (
            ["text", "textarea", "richtext", "email", "number"].includes(type)
        ) {
            // These are expected to be objects with language keys by the form,
            // as 'value' is a translatable JSON field in the Setting model.
            initialFormData[key] = (
                Array.isArray(activeLanguages) ? activeLanguages : []
            ).reduce((acc, lang) => {
                acc[lang] = value?.[lang] ?? "";
                return acc;
            }, {});
        } else {
            // Fallback for unknown types, treat as simple text for now (might need adjustment)
            initialFormData[key] = (
                Array.isArray(activeLanguages) ? activeLanguages : []
            ).reduce((acc, lang) => {
                acc[lang] = value?.[lang] ?? "";
                return acc;
            }, {});
        }
    });
    initialFormData._method = "PUT";

    const { data, setData, put, processing, errors } = useForm(initialFormData);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.settings.update"), {
            preserveScroll: true,
        });
    };

    const handleFieldChange = (key, langCode, value, type) => {
        if (type === "boolean") {
            setData(key, value); // Direct boolean value
        } else {
            setData(key, { ...data[key], [langCode]: value });
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
                    <Grid item xs={12} key={key} sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!!data[key]} // Ensure it's boolean
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
                            <FormHelperText error>{errors[key]}</FormHelperText>
                        )}
                    </Grid>
                );
            case "text":
            case "email":
            case "number":
                return activeLanguages.map((lang) => (
                    <Grid
                        item
                        xs={12}
                        md={activeLanguages.length > 1 ? 4 : 12}
                        key={`<span class="math-inline">\{key\}\-</span>{lang}`}
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
                            id={`<span class="math-inline">\{key\}\-</span>{lang}`}
                            label={`<span class="math-inline">\{labelBase\} \(</span>{lang.toUpperCase()})`}
                            value={data[key]?.[lang] ?? ""}
                            onChange={(e) =>
                                handleFieldChange(
                                    key,
                                    lang,
                                    e.target.value,
                                    type,
                                )
                            }
                            error={
                                !!errors[
                                    `<span class="math-inline">\{key\}\.</span>{lang}`
                                ]
                            }
                            helperText={
                                errors[
                                    `<span class="math-inline">\{key\}\.</span>{lang}`
                                ]
                            }
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                ));
            case "textarea":
            case "richtext": // Treat richtext as textarea for now
                return activeLanguages.map((lang) => (
                    <Grid
                        item
                        xs={12}
                        md={activeLanguages.length > 1 ? 4 : 12}
                        key={`<span class="math-inline">\{key\}\-</span>{lang}`}
                    >
                        <TextField
                            fullWidth
                            multiline
                            rows={type === "richtext" ? 8 : 4}
                            id={`<span class="math-inline">\{key\}\-</span>{lang}`}
                            label={`<span class="math-inline">\{labelBase\} \(</span>{lang.toUpperCase()})${type === "richtext" ? " (Basic Text)" : ""}`}
                            value={data[key]?.[lang] ?? ""}
                            onChange={(e) =>
                                handleFieldChange(
                                    key,
                                    lang,
                                    e.target.value,
                                    type,
                                )
                            }
                            error={
                                !!errors[
                                    `<span class="math-inline">\{key\}\.</span>{lang}`
                                ]
                            }
                            helperText={
                                errors[
                                    `<span class="math-inline">\{key\}\.</span>{lang}`
                                ]
                            }
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                ));
            default:
                return (
                    <Grid item xs={12} key={key}>
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
                Site Settings
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
                                <Paper sx={{ p: 3, width: "100%" }}>
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
                    item
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
