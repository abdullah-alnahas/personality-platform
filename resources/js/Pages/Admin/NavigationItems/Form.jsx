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
} from "@mui/material";

const activeLanguages = [
    { code: "en", name: "English" },
    { code: "ar", name: "Arabic" },
    { code: "tr", name: "Turkish" },
]; // Fallback or pass from props
const getTranslatedField = (
    fieldObject,
    pageProps,
    locale = "en",
    fallback = "",
) => {
    /* ... (same as before) ... */
    const currentLocale = pageProps.locale || locale;
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

export default function Form({
    item,
    parentOptions,
    activeLanguages: propActiveLanguages,
}) {
    const isEditing = !!item;
    const { props: pageProps } = usePage();
    const currentActiveLanguages = Array.isArray(propActiveLanguages)
        ? propActiveLanguages
        : activeLanguages;

    const { data, setData, post, put, processing, errors } = useForm({
        label: currentActiveLanguages.reduce(
            (acc, lang) => ({
                ...acc,
                [lang.code]: item?.label?.[lang.code] ?? "",
            }),
            {},
        ),
        menu_location: item?.menu_location ?? "header",
        url: item?.url ?? "",
        target: item?.target ?? "_self",
        order: item?.order ?? 0,
        parent_id: item?.parent_id ?? "",
        status: item?.status ?? "published",
        _method: isEditing ? "PUT" : "POST",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = isEditing
            ? "admin.navigation-items.update"
            : "admin.navigation-items.store";
        const routeParams = isEditing ? item.id : [];
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
            <Head
                title={
                    isEditing
                        ? "Edit Navigation Item"
                        : "Create Navigation Item"
                }
            />
            <Typography variant="h4" gutterBottom>
                {isEditing
                    ? `Edit Item: ${getTranslatedField(item.label, pageProps)}`
                    : "Create New Navigation Item"}
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <Grid container spacing={3}>
                        {currentActiveLanguages.map((lang) => (
                            <Grid xs={12} md={4} key={`label-${lang.code}`}>
                                <TextField
                                    required
                                    fullWidth
                                    id={`label-${lang.code}`}
                                    label={`Label (${lang.name})`}
                                    name={`label[${lang.code}]`}
                                    value={data.label[lang.code]}
                                    onChange={(e) =>
                                        handleTranslatableChange(
                                            e,
                                            lang.code,
                                            "label",
                                        )
                                    }
                                    error={!!errors[`label.${lang.code}`]}
                                    helperText={errors[`label.${lang.code}`]}
                                />
                            </Grid>
                        ))}
                        <Grid xs={12}>
                            <Divider>Details</Divider>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                id="url"
                                label="URL (e.g., /about, https://example.com)"
                                name="url"
                                value={data.url}
                                onChange={(e) => setData("url", e.target.value)}
                                error={!!errors.url}
                                helperText={errors.url}
                            />
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <FormControl
                                fullWidth
                                error={!!errors.menu_location}
                            >
                                <InputLabel id="menu_location-label">
                                    Menu Location
                                </InputLabel>
                                <Select
                                    labelId="menu_location-label"
                                    id="menu_location"
                                    name="menu_location"
                                    value={data.menu_location}
                                    label="Menu Location"
                                    required
                                    onChange={(e) =>
                                        setData("menu_location", e.target.value)
                                    }
                                >
                                    <MenuItem value="header">Header</MenuItem>
                                    <MenuItem value="footer_col1">
                                        Footer Column 1
                                    </MenuItem>
                                    <MenuItem value="footer_col2">
                                        Footer Column 2
                                    </MenuItem>
                                </Select>
                                {errors.menu_location && (
                                    <FormHelperText>
                                        {errors.menu_location}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <FormControl fullWidth error={!!errors.target}>
                                <InputLabel id="target-label">
                                    Target
                                </InputLabel>
                                <Select
                                    labelId="target-label"
                                    id="target"
                                    name="target"
                                    value={data.target}
                                    label="Target"
                                    required
                                    onChange={(e) =>
                                        setData("target", e.target.value)
                                    }
                                >
                                    <MenuItem value="_self">
                                        Same Window (_self)
                                    </MenuItem>
                                    <MenuItem value="_blank">
                                        New Window (_blank)
                                    </MenuItem>
                                </Select>
                                {errors.target && (
                                    <FormHelperText>
                                        {errors.target}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.parent_id}>
                                <InputLabel id="parent-label">
                                    Parent Item (Optional)
                                </InputLabel>
                                <Select
                                    labelId="parent-label"
                                    id="parent_id"
                                    name="parent_id"
                                    value={data.parent_id}
                                    label="Parent Item (Optional)"
                                    onChange={(e) =>
                                        setData("parent_id", e.target.value)
                                    }
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {parentOptions.map((option) => (
                                        <MenuItem
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {getTranslatedField(
                                                option.label,
                                                pageProps,
                                            )}{" "}
                                            (ID: {option.id})
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.parent_id && (
                                    <FormHelperText>
                                        {errors.parent_id}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                id="order"
                                label="Display Order"
                                name="order"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={data.order}
                                onChange={(e) =>
                                    setData("order", e.target.value)
                                }
                                error={!!errors.order}
                                helperText={
                                    errors.order ??
                                    "Lower numbers appear first."
                                }
                            />
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
                                    <MenuItem value="published">
                                        Published
                                    </MenuItem>
                                    <MenuItem value="draft">Draft</MenuItem>
                                </Select>
                                {errors.status && (
                                    <FormHelperText>
                                        {errors.status}
                                    </FormHelperText>
                                )}
                            </FormControl>
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
                                href={route("admin.navigation-items.index")}
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
                                      ? "Update Item"
                                      : "Create Item"}
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
        title={
            page.props.item ? "Edit Navigation Item" : "Create Navigation Item"
        }
    />
);
