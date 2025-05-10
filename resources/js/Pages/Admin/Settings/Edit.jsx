import React from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import RichTextEditor from "@/Components/RichTextEditor"; // <-- Import RichTextEditor
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
    const { props } = usePage();
    const defaultLocale = props.locale || "en";
    const activeLanguages = Array.isArray(propActiveLanguages)
        ? propActiveLanguages
        : props.activeLanguages || ["en", "ar", "tr"];

    const initialFormData = {};
    // Ensure settings is an object before calling Object.values
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
        // Prepare data for submission, especially for boolean values
        const dataToSubmit = { ...data };
        Object.values(settings || {}).forEach((setting) => {
            if (setting.type === "boolean") {
                // Store booleans as '1' or '0' string in the default locale, as per seeder
                dataToSubmit[setting.key] = {
                    [defaultLocale]: data[setting.key] ? "1" : "0",
                };
            }
        });

        put(route("admin.settings.update"), {
            data: dataToSubmit, // Send prepared data
            preserveScroll: true,
        });
    };

    // Updated to handle direct value from RTE and Switch, and event from TextField
    const handleFieldChange = (key, langCode, valueOrEvent, type) => {
        if (type === "boolean") {
            setData(key, valueOrEvent); // valueOrEvent is the boolean from Switch's event.target.checked
        } else if (
            type === "richtext" ||
            (valueOrEvent && typeof valueOrEvent !== "object")
        ) {
            // Direct value from RTE or simple input
            setData(key, { ...data[key], [langCode]: valueOrEvent });
        } else if (valueOrEvent && valueOrEvent.target) {
            // Event from TextField
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
                    <Grid item xs={12} key={key} sx={{ mb: 2 }}>
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
                                handleFieldChange(key, lang, e, type)
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
                            rows={4}
                            id={`<span class="math-inline">\{key\}\-</span>{lang}`}
                            label={`<span class="math-inline">\{labelBase\} \(</span>{lang.toUpperCase()})`}
                            value={data[key]?.[lang] ?? ""}
                            onChange={(e) =>
                                handleFieldChange(key, lang, e, type)
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
            case "richtext": // Use RichTextEditor for 'richtext' type
                return activeLanguages.map((lang) => (
                    <Grid
                        item
                        xs={12}
                        md={activeLanguages.length > 1 ? 4 : 12}
                        key={`<span class="math-inline">\{key\}\-</span>{lang}`}
                    >
                        <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                        >{`<span class="math-inline">\{labelBase\} \(</span>{lang.toUpperCase()})`}</Typography>
                        <RichTextEditor
                            value={data[key]?.[lang] || ""}
                            onChange={(value) =>
                                handleFieldChange(key, lang, value, type)
                            }
                            placeholder={`Enter content for <span class="math-inline">\{labelBase\} \(</span>{lang.toUpperCase()})...`}
                            direction={lang === "ar" ? "rtl" : "ltr"}
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
