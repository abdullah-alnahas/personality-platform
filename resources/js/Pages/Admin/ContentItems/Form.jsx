import React, { useState, useEffect } from "react";
import {
    Head,
    Link as InertiaLink,
    useForm,
    usePage,
    router,
} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import RichTextEditor from "@/Components/RichTextEditor";
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
    Card,
    CardMedia,
    Input,
    LinearProgress,
} from "@mui/material";
import {
    DateTimePicker, // No need for LocalizationProvider here, it's in app.jsx
} from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const getTranslatedFieldLocal = (
    fieldObject,
    pageProps, // Pass the entire page props
    localeKeyToUse = "en", // Default locale to try
    fallback = "",
) => {
    const currentLocale = pageProps.locale || localeKeyToUse; // Get current locale from shared props
    if (!fieldObject) return fallback;
    if (typeof fieldObject !== "object" || fieldObject === null)
        return String(fieldObject) || fallback;
    return (
        fieldObject[currentLocale] ||
        fieldObject[localeKeyToUse] || // Fallback to specified localeKeyToUse
        Object.values(fieldObject)[0] || // Fallback to first available translation
        fallback
    );
};

export default function Form({
    item, // The content item being edited, or null if creating
    categories, // Array of available categories
    featured_image_url, // URL of the existing featured image (if any)
    activeLanguages: controllerActiveLanguages, // Array of active language codes ['en', 'ar', 'tr']
}) {
    const isEditing = !!item;
    const [imagePreview, setImagePreview] = useState(
        featured_image_url || null,
    );
    const { props: pageProps } = usePage(); // Get all page props, including 'locale'

    // Ensure activeLanguages is an array of strings, fallback if not provided correctly
    const activeLanguages =
        Array.isArray(controllerActiveLanguages) &&
        controllerActiveLanguages.every((lang) => typeof lang === "string")
            ? controllerActiveLanguages
            : ["en", "ar", "tr"]; // Default fallback

    const { data, setData, post, processing, errors, reset, progress } =
        useForm({
            title: activeLanguages.reduce(
                (acc, lang) => ({ ...acc, [lang]: item?.title?.[lang] ?? "" }),
                {},
            ),
            content: activeLanguages.reduce(
                (acc, lang) => ({
                    ...acc,
                    [lang]: item?.content?.[lang] ?? "",
                }),
                {},
            ),
            excerpt: activeLanguages.reduce(
                (acc, lang) => ({
                    ...acc,
                    [lang]: item?.excerpt?.[lang] ?? "",
                }),
                {},
            ),
            featured_image_alt_text: activeLanguages.reduce(
                // Initialize alt text field
                (acc, lang) => ({
                    ...acc,
                    [lang]: item?.featured_image_alt_text?.[lang] ?? "",
                }),
                {},
            ),
            content_category_id: item?.content_category_id ?? "",
            status: item?.status ?? "draft",
            publish_date: item?.publish_date ? dayjs(item.publish_date) : null, // Ensure dayjs object for DateTimePicker
            is_featured_home: item?.is_featured_home ?? false,
            featured_image: null, // For new image uploads
            remove_featured_image: false, // Flag to indicate if existing image should be removed
            _method: isEditing ? "PUT" : "POST", // For Laravel method spoofing
        });

    // Effect to update image preview when a new file is selected or existing image is loaded
    useEffect(() => {
        if (data.featured_image instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(data.featured_image);
        } else if (!featured_image_url && !data.featured_image) {
            // No existing and no new file
            setImagePreview(null);
        } else if (
            featured_image_url &&
            !data.featured_image &&
            !data.remove_featured_image
        ) {
            // Existing image, no new file, not marked for removal
            setImagePreview(featured_image_url);
        }
        // If data.remove_featured_image is true, preview is handled by handleRemoveImage
    }, [data.featured_image, featured_image_url, data.remove_featured_image]);

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset("featured_image"); // Only reset the file input on success
                // Snackbar for success will be handled by AdminLayout
            },
            onError: (formErrors) => {
                console.error("Form submission errors:", formErrors);
                // Snackbar for error will be handled by AdminLayout or specific error display here
            },
            forceFormData: true, // Ensures data is sent as FormData when files are present
        };

        const routeName = isEditing
            ? "admin.content-items.update"
            : "admin.content-items.store";
        const routeParams = isEditing ? item.id : [];

        // Prepare data for submission, especially date format
        const dataToSend = {
            ...data,
            publish_date: data.publish_date
                ? data.publish_date.toISOString() // Convert Dayjs object to ISO string
                : null,
        };

        // Use router.post for both create and update when dealing with files and _method spoofing
        router.post(route(routeName, routeParams), dataToSend, options);
    };

    // Handler for translatable fields (TextField, RichTextEditor)
    const handleTranslatableChange = (fieldName, langCode, valueOrEvent) => {
        let newValue;
        if (
            valueOrEvent &&
            typeof valueOrEvent === "object" &&
            valueOrEvent.target // Check if it's a standard input event
        ) {
            newValue = valueOrEvent.target.value;
        } else {
            newValue = valueOrEvent; // Direct value from RichTextEditor or other custom components
        }
        setData(fieldName, { ...data[fieldName], [langCode]: newValue });
    };

    // Handler for file input change
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setData("featured_image", e.target.files[0]);
            setData("remove_featured_image", false); // If a new file is selected, ensure not to remove
        }
    };

    // Handler to remove the current featured image
    const handleRemoveImage = () => {
        setData({ ...data, featured_image: null, remove_featured_image: true });
        setImagePreview(null);
        const fileInput = document.getElementById("featured_image_input"); // Reset the actual file input
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <>
            <Head
                title={isEditing ? "Edit Content Item" : "Create Content Item"}
            />
            <Typography variant="h4" gutterBottom>
                {isEditing
                    ? `Edit Item: ${getTranslatedFieldLocal(item.title, pageProps)}`
                    : "Create New Content Item"}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                    // encType="multipart/form-data" // Inertia handles this with router.post and FormData
                >
                    <Grid container spacing={3}>
                        {/* Translatable Title Fields */}
                        {activeLanguages.map((lang) => (
                            <Grid
                                item
                                xs={12}
                                md={activeLanguages.length > 1 ? 4 : 12}
                                key={`title-${lang}`}
                            >
                                <TextField
                                    required={
                                        lang === (pageProps.locale || "en")
                                    } // Require for current/default locale
                                    fullWidth
                                    id={`title-${lang}`}
                                    label={`Title (${lang.toUpperCase()})`}
                                    name={`title[${lang}]`}
                                    value={data.title[lang]}
                                    onChange={(e) =>
                                        handleTranslatableChange(
                                            "title",
                                            lang,
                                            e,
                                        )
                                    }
                                    error={!!errors[`title.${lang}`]} // Specific error for each language field
                                    helperText={errors[`title.${lang}`]}
                                />
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Divider>Content & Details</Divider>
                        </Grid>

                        {/* Translatable Excerpt Fields */}
                        {activeLanguages.map((lang) => (
                            <Grid
                                item
                                xs={12}
                                md={activeLanguages.length > 1 ? 4 : 12}
                                key={`excerpt-${lang}`}
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id={`excerpt-${lang}`}
                                    label={`Excerpt (${lang.toUpperCase()})`}
                                    name={`excerpt[${lang}]`}
                                    value={data.excerpt[lang]}
                                    onChange={(e) =>
                                        handleTranslatableChange(
                                            "excerpt",
                                            lang,
                                            e,
                                        )
                                    }
                                    error={!!errors[`excerpt.${lang}`]}
                                    helperText={errors[`excerpt.${lang}`]}
                                />
                            </Grid>
                        ))}

                        {/* Translatable Content Fields (RichTextEditor) */}
                        <Grid item xs={12}>
                            <Typography
                                variant="subtitle1"
                                gutterBottom
                                sx={{ mb: 1 }}
                            >
                                Main Content
                            </Typography>
                        </Grid>
                        {activeLanguages.map((lang) => (
                            <Grid
                                item
                                xs={12}
                                md={activeLanguages.length > 1 ? 4 : 12}
                                key={`content-${lang}`}
                            >
                                <Typography
                                    variant="caption"
                                    display="block"
                                    gutterBottom
                                >{`Content (${lang.toUpperCase()})`}</Typography>
                                <RichTextEditor
                                    value={data.content[lang] || ""}
                                    onChange={(value) =>
                                        handleTranslatableChange(
                                            "content",
                                            lang,
                                            value,
                                        )
                                    }
                                    placeholder={`Enter content for ${lang.toUpperCase()}...`}
                                    direction={lang === "ar" ? "rtl" : "ltr"} // Handle RTL for Arabic
                                    error={!!errors[`content.${lang}`]}
                                    helperText={errors[`content.${lang}`]}
                                />
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Divider>Configuration</Divider>
                        </Grid>

                        {/* Category Select */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl
                                fullWidth
                                error={!!errors.content_category_id}
                            >
                                <InputLabel id="category-label">
                                    Category
                                </InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="content_category_id"
                                    name="content_category_id"
                                    value={data.content_category_id}
                                    label="Category"
                                    required
                                    onChange={(e) =>
                                        setData(
                                            "content_category_id",
                                            e.target.value,
                                        )
                                    }
                                >
                                    <MenuItem value="">
                                        <em>Select Category</em>
                                    </MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {getTranslatedFieldLocal(
                                                cat.name,
                                                pageProps,
                                            )}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.content_category_id && (
                                    <FormHelperText>
                                        {errors.content_category_id}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Status Select */}
                        <Grid item xs={12} sm={6} md={4}>
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

                        {/* Publish Date Picker */}
                        <Grid item xs={12} sm={6} md={4}>
                            <DateTimePicker
                                label="Publish Date/Time"
                                value={data.publish_date} // Expects Dayjs object or null
                                onChange={(newValue) =>
                                    setData("publish_date", newValue)
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.publish_date,
                                        helperText:
                                            errors.publish_date ||
                                            "Leave blank to publish immediately (if status is 'published').",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Featured on Homepage Switch */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.is_featured_home}
                                        onChange={(e) =>
                                            setData(
                                                "is_featured_home",
                                                e.target.checked,
                                            )
                                        }
                                        name="is_featured_home"
                                    />
                                }
                                label="Feature on Homepage?"
                            />
                            {errors.is_featured_home && (
                                <FormHelperText error>
                                    {errors.is_featured_home}
                                </FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Divider>Featured Image</Divider>
                        </Grid>

                        {/* Featured Image Upload */}
                        <Grid item xs={12} md={6}>
                            <FormControl
                                fullWidth
                                error={!!errors.featured_image}
                                sx={{ mb: activeLanguages.length > 1 ? 0 : 2 }}
                            >
                                <InputLabel
                                    shrink
                                    htmlFor="featured_image_input"
                                    sx={{
                                        position: "static",
                                        mb: 1,
                                        transform: "none",
                                    }}
                                >
                                    Upload/Replace Image (Max 2MB)
                                </InputLabel>
                                <Input
                                    accept="image/*"
                                    id="featured_image_input" // Ensure this ID is unique if form is part of a larger page
                                    type="file"
                                    onChange={handleFileChange}
                                    sx={{ display: "block" }}
                                    key={
                                        data.featured_image
                                            ? "file-selected"
                                            : "no-file"
                                    } // Force re-render to clear
                                />
                                {progress && (
                                    <Box sx={{ width: "100%", mt: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress.percentage}
                                        />
                                        <Typography variant="caption">
                                            {progress.percentage}%
                                        </Typography>
                                    </Box>
                                )}
                                {errors.featured_image && (
                                    <FormHelperText>
                                        {errors.featured_image}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {imagePreview && (
                                <Card
                                    sx={{ maxWidth: 300, position: "relative" }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={imagePreview}
                                        alt="Featured Image Preview"
                                        height="150"
                                    />
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={handleRemoveImage}
                                        sx={{
                                            position: "absolute",
                                            top: 5,
                                            right: 5,
                                            backgroundColor:
                                                "rgba(255,255,255,0.7)",
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Card>
                            )}
                            {/* Hidden input for remove_featured_image flag, useful if not using FormData explicitly for simple cases */}
                            {isEditing && featured_image_url && (
                                <input
                                    type="hidden"
                                    name="remove_featured_image"
                                    value={
                                        data.remove_featured_image ? "1" : "0"
                                    }
                                />
                            )}
                        </Grid>

                        {/* Translatable Featured Image Alt Text */}
                        <Grid
                            item
                            xs={12}
                            sx={{ mt: activeLanguages.length > 1 ? 0 : 2 }}
                        >
                            <Typography variant="subtitle2" gutterBottom>
                                Featured Image Alt Text (Recommended for
                                Accessibility)
                            </Typography>
                        </Grid>
                        {activeLanguages.map((lang) => (
                            <Grid
                                item
                                xs={12}
                                md={activeLanguages.length > 1 ? 4 : 12}
                                key={`alt-text-${lang}`}
                            >
                                <TextField
                                    fullWidth
                                    id={`featured_image_alt_text-${lang}`}
                                    label={`Alt Text (${lang.toUpperCase()})`}
                                    name={`featured_image_alt_text[${lang}]`}
                                    value={data.featured_image_alt_text[lang]}
                                    onChange={(e) =>
                                        handleTranslatableChange(
                                            "featured_image_alt_text",
                                            lang,
                                            e,
                                        )
                                    }
                                    error={
                                        !!errors[
                                            `featured_image_alt_text.${lang}`
                                        ]
                                    }
                                    helperText={
                                        errors[
                                            `featured_image_alt_text.${lang}`
                                        ] ||
                                        "Describe the image for screen readers."
                                    }
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        ))}

                        {/* Action Buttons */}
                        <Grid
                            item
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
                                href={route("admin.content-items.index")}
                                variant="outlined"
                                disabled={processing}
                            >
                                {" "}
                                Cancel{" "}
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
        title={page.props.item ? "Edit Content Item" : "Create Content Item"}
    />
);
