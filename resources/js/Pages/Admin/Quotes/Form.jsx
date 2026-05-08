import React from "react";
import { Head, Link as InertiaLink, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Divider,
    Switch,
    FormControlLabel,
} from "@mui/material";

const getTranslatedField = (fieldObject, locale = "en", fallback = "") => {
    const { props } = usePage();
    const currentLocale = props.locale || locale;
    if (!fieldObject) return fallback;
    if (typeof fieldObject !== "object" || fieldObject === null)
        return String(fieldObject) || fallback;
    return (
        fieldObject[currentLocale] ||
        fieldObject[locale] ||
        Object.values(fieldObject)[0] ||
        fallback
    );
};

export default function Form({ quote, activeLanguages }) {
    const isEditing = !!quote;
    const { props: pageProps } = usePage();
    const defaultLocale = pageProps.locale || "en";
    const languagesToIterate = Array.isArray(activeLanguages)
        ? activeLanguages
        : [];

    const { data, setData, post, put, processing, errors } = useForm({
        text: languagesToIterate.reduce(
            (acc, lang) => ({ ...acc, [lang]: quote?.text?.[lang] ?? "" }),
            {},
        ),
        source: languagesToIterate.reduce(
            (acc, lang) => ({ ...acc, [lang]: quote?.source?.[lang] ?? "" }),
            {},
        ),
        status: quote?.status ?? "draft",
        is_featured: quote?.is_featured ?? false,
        _method: isEditing ? "PUT" : "POST",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = isEditing
            ? "admin.quotes.update"
            : "admin.quotes.store";
        const routeParams = isEditing ? quote.id : [];
        if (isEditing) {
            put(route(routeName, routeParams), { preserveScroll: true });
        } else {
            post(route(routeName, routeParams), { preserveScroll: true });
        }
    };

    const handleTranslatableChange = (e, langCode, fieldName) => {
        setData(fieldName, { ...data[fieldName], [langCode]: e.target.value });
    };

    return (
        <>
            <Head title={isEditing ? "Edit Quote" : "Create Quote"} />
            <Typography variant="h4" gutterBottom>
                {isEditing
                    ? `Edit Quote: "${getTranslatedField(quote.text, defaultLocale).substring(0, 30)}..."`
                    : "Create New Quote"}
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <Typography variant="h6">Quote Text</Typography>
                        </Grid>
                        {languagesToIterate.map((lang) => (
                            <Grid
                                xs={12}
                                md={languagesToIterate.length > 1 ? 4 : 12}
                                key={`text-${lang}`}
                            >
                                <TextField
                                    required={lang === defaultLocale}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    id={`text-${lang}`}
                                    label={`Text (${lang.toUpperCase()})`}
                                    name={`text[${lang}]`}
                                    value={data.text[lang]}
                                    onChange={(e) =>
                                        handleTranslatableChange(
                                            e,
                                            lang,
                                            "text",
                                        )
                                    }
                                    error={!!errors[`text.${lang}`]}
                                    helperText={errors[`text.${lang}`]}
                                />
                            </Grid>
                        ))}
                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }}>Optional Details</Divider>
                        </Grid>
                        <Grid xs={12}>
                            <Typography variant="h6">Source</Typography>
                        </Grid>
                        {languagesToIterate.map((lang) => (
                            <Grid
                                xs={12}
                                md={languagesToIterate.length > 1 ? 4 : 12}
                                key={`source-${lang}`}
                            >
                                <TextField
                                    fullWidth
                                    id={`source-${lang}`}
                                    label={`Source (${lang.toUpperCase()})`}
                                    name={`source[${lang}]`}
                                    value={data.source[lang]}
                                    onChange={(e) =>
                                        handleTranslatableChange(
                                            e,
                                            lang,
                                            "source",
                                        )
                                    }
                                    error={!!errors[`source.${lang}`]}
                                    helperText={errors[`source.${lang}`]}
                                />
                            </Grid>
                        ))}
                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }}>Configuration</Divider>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.status}>
                                <InputLabel id="status-label">
                                    Status
                                </InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    label="Status"
                                    required
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="published">
                                        Published
                                    </MenuItem>
                                </Select>
                                {errors.status && (
                                    <FormHelperText>
                                        {errors.status}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.is_featured}
                                        onChange={(e) =>
                                            setData(
                                                "is_featured",
                                                e.target.checked,
                                            )
                                        }
                                        name="is_featured"
                                    />
                                }
                                label="Feature this quote?"
                            />
                            {errors.is_featured && (
                                <FormHelperText error>
                                    {errors.is_featured}
                                </FormHelperText>
                            )}
                        </Grid>
                        <Grid
                            xs={12}
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <Button
                                component={InertiaLink}
                                href={route("admin.quotes.index")}
                                variant="outlined"
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                            >
                                {processing
                                    ? "Saving..."
                                    : isEditing
                                      ? "Update Quote"
                                      : "Create Quote"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
}
Form.layout = (page) => (
    <AdminLayout
        children={page}
        title={page.props.quote ? "Edit Quote" : "Create Quote"}
    />
);
