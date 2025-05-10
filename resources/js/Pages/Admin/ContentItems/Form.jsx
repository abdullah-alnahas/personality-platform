import React, { useState, useEffect } from "react";
import {
    Head,
    Link as InertiaLink,
    useForm,
    router,
    usePage,
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
    Alert,
    Input,
    LinearProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const getTranslatedFieldLocal = (
    fieldObject,
    pageProps,
    localeKeyToUse = "en",
    fallback = "",
) => {
    const currentLocale = pageProps.locale || localeKeyToUse;
    if (!fieldObject) return fallback;
    if (typeof fieldObject !== "object" || fieldObject === null)
        return String(fieldObject) || fallback;
    return (
        fieldObject[currentLocale] ||
        fieldObject[localeKeyToUse] ||
        Object.values(fieldObject)[0] ||
        fallback
    );
};

// The prop from controller is now `activeLanguages`
export default function Form({
    item,
    categories,
    featured_image_url,
    activeLanguages: controllerActiveLanguages,
}) {
    const isEditing = !!item;
    const [imagePreview, setImagePreview] = useState(
        featured_image_url || null,
    );
    const { props } = usePage();

    // Use the prop from controller if available, otherwise fallback to a default array of strings
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
            content_category_id: item?.content_category_id ?? "",
            status: item?.status ?? "draft",
            publish_date: item?.publish_date ? dayjs(item.publish_date) : null,
            is_featured_home: item?.is_featured_home ?? false,
            featured_image: null,
            remove_featured_image: false,
            _method: isEditing ? "PUT" : "POST",
        });

    // useEffect for imagePreview remains the same
    useEffect(() => {
        if (data.featured_image instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(data.featured_image);
        } else if (!featured_image_url && !data.featured_image) {
            setImagePreview(null);
        } else if (
            featured_image_url &&
            !data.featured_image &&
            !data.remove_featured_image
        ) {
            setImagePreview(featured_image_url);
        }
    }, [data.featured_image, featured_image_url, data.remove_featured_image]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => reset("featured_image"),
            onError: (err) => console.error(err),
        };
        const routeName = isEditing
            ? "admin.content-items.update"
            : "admin.content-items.store";
        const routeParams = isEditing ? item.id : [];
        const dataToSend = {
            ...data,
            publish_date: data.publish_date
                ? data.publish_date.toISOString()
                : null,
        };
        router.post(route(routeName, routeParams), dataToSend, options);
    };

    const handleTranslatableChange = (fieldName, langCode, valueOrEvent) => {
        let newValue;
        if (
            valueOrEvent &&
            typeof valueOrEvent === "object" &&
            valueOrEvent.target
        ) {
            newValue = valueOrEvent.target.value;
        } else {
            newValue = valueOrEvent;
        }
        setData(fieldName, { ...data[fieldName], [langCode]: newValue });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setData("featured_image", e.target.files[0]);
            setData("remove_featured_image", false);
        }
    };
    const handleRemoveImage = () => {
        setData({ ...data, featured_image: null, remove_featured_image: true });
        setImagePreview(null);
    };

    return (
        <>
            <Head
                title={isEditing ? "Edit Content Item" : "Create Content Item"}
            />
            <Typography variant="h4" gutterBottom>
                {isEditing
                    ? `Edit Item: ${getTranslatedFieldLocal(item.title, props)}`
                    : "Create New Content Item"}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                    encType="multipart/form-data"
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
                                    required
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
                                    error={!!errors[`title.${lang}`]}
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
                                    direction={lang === "ar" ? "rtl" : "ltr"}
                                    error={!!errors[`content.${lang}`]}
                                    helperText={errors[`content.${lang}`]}
                                />
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Divider>Configuration</Divider>
                        </Grid>
                        {/* Category, Status, Publish Date, Featured, Image sections ... */}
                        <Grid item xs={12} sm={6} md={4}>
                            {" "}
                            {/* Category */}
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
                                                props,
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
                        <Grid item xs={12} sm={6} md={4}>
                            {" "}
                            {/* Status */}
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
                        <Grid item xs={12} sm={6} md={4}>
                            {" "}
                            {/* Publish Date */}
                            <DateTimePicker
                                label="Publish Date/Time"
                                value={data.publish_date}
                                onChange={(newValue) =>
                                    setData("publish_date", newValue)
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.publish_date,
                                        helperText: errors.publish_date,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            {" "}
                            {/* Featured Switch */}
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
                        <Grid item xs={12} md={6}>
                            <FormControl
                                fullWidth
                                error={!!errors.featured_image}
                            >
                                <InputLabel
                                    shrink
                                    htmlFor="featured_image_input"
                                    sx={{ position: "static", mb: 1 }}
                                >
                                    {" "}
                                    Featured Image (Max 2MB){" "}
                                </InputLabel>
                                <Input
                                    accept="image/*"
                                    id="featured_image_input"
                                    type="file"
                                    onChange={handleFileChange}
                                    sx={{ display: "block" }}
                                />
                                {progress && (
                                    <Box sx={{ width: "100%", mt: 1 }}>
                                        {" "}
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress.percentage}
                                        />{" "}
                                        <Typography variant="caption">
                                            {progress.percentage}%
                                        </Typography>{" "}
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
                                    {" "}
                                    <CardMedia
                                        component="img"
                                        image={imagePreview}
                                        alt="Featured Image Preview"
                                        height="150"
                                    />{" "}
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
                                    </Button>{" "}
                                </Card>
                            )}
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
