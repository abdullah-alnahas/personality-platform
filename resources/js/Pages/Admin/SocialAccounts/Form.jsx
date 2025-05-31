import React from "react";
import { Head, Link as InertiaLink, useForm, usePage } from "@inertiajs/react"; // Added usePage
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
];
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
const platforms = [
    "facebook",
    "instagram",
    "youtube",
    "telegram",
    "x",
    "twitter",
    "linkedin",
    "tiktok",
    "other",
];

export default function Form({
    account,
    activeLanguages: propActiveLanguages,
}) {
    const isEditing = !!account;
    const { props: pageProps } = usePage();
    const currentActiveLanguages = Array.isArray(propActiveLanguages)
        ? propActiveLanguages
        : activeLanguages;

    const { data, setData, post, put, processing, errors } = useForm({
        account_name: currentActiveLanguages.reduce(
            (acc, lang) => ({
                ...acc,
                [lang.code]: account?.account_name?.[lang.code] ?? "",
            }),
            {},
        ),
        platform: account?.platform ?? "other",
        url: account?.url ?? "",
        display_order: account?.display_order ?? 0,
        status: account?.status ?? "active",
        _method: isEditing ? "PUT" : "POST",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = isEditing
            ? "admin.social-accounts.update"
            : "admin.social-accounts.store";
        const routeParams = isEditing ? account.id : [];
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
                    isEditing ? "Edit Social Account" : "Create Social Account"
                }
            />
            <Typography variant="h4" gutterBottom>
                {isEditing
                    ? `Edit Account: ${getTranslatedField(account.account_name, pageProps) || account.platform}`
                    : "Create New Social Account"}
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <Grid container spacing={3}>
                        <Grid xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.platform}>
                                <InputLabel id="platform-label">
                                    Platform
                                </InputLabel>
                                <Select
                                    labelId="platform-label"
                                    id="platform"
                                    name="platform"
                                    value={data.platform}
                                    label="Platform"
                                    required
                                    onChange={(e) =>
                                        setData("platform", e.target.value)
                                    }
                                >
                                    {platforms.map((p) => (
                                        <MenuItem key={p} value={p}>
                                            {p.charAt(0).toUpperCase() +
                                                p.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.platform && (
                                    <FormHelperText>
                                        {errors.platform}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6} md={8}>
                            <TextField
                                required
                                fullWidth
                                id="url"
                                label="Profile/Channel URL"
                                name="url"
                                value={data.url}
                                onChange={(e) => setData("url", e.target.value)}
                                error={!!errors.url}
                                helperText={
                                    errors.url ??
                                    "Enter the full URL (e.g., https://...)"
                                }
                                type="url"
                            />
                        </Grid>
                        <Grid xs={12}>
                            <Divider>Optional Details</Divider>
                        </Grid>
                        {currentActiveLanguages.map((lang) => (
                            <Grid
                                xs={12}
                                md={4}
                                key={`account_name-${lang.code}`}
                            >
                                <TextField
                                    fullWidth
                                    id={`account_name-${lang.code}`}
                                    label={`Account Name (${lang.name})`}
                                    name={`account_name[${lang.code}]`}
                                    value={data.account_name[lang.code]}
                                    onChange={(e) =>
                                        handleTranslatableChange(
                                            e,
                                            lang.code,
                                            "account_name",
                                        )
                                    }
                                    error={
                                        !!errors[`account_name.${lang.code}`]
                                    }
                                    helperText={
                                        errors[`account_name.${lang.code}`] ??
                                        "Optional (e.g., Personal, Institute)"
                                    }
                                />
                            </Grid>
                        ))}
                        <Grid xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                id="display_order"
                                label="Display Order"
                                name="display_order"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={data.display_order}
                                onChange={(e) =>
                                    setData("display_order", e.target.value)
                                }
                                error={!!errors.display_order}
                                helperText={
                                    errors.display_order ??
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
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">
                                        Inactive
                                    </MenuItem>
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
                                href={route("admin.social-accounts.index")}
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
                                      ? "Update Account"
                                      : "Create Account"}
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
            page.props.account ? "Edit Social Account" : "Create Social Account"
        }
    />
);
