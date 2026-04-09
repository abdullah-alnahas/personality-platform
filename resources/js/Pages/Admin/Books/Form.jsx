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
    FormControlLabel,
    Switch,
    FormHelperText,
    Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const LANGS = ["ar", "en", "tr"];

export default function Form({ book }) {
    const isEditing = !!book;
    const { props } = usePage();
    const activeLanguages = props.activeLanguages || LANGS;

    const { data, setData, post, processing, errors } = useForm({
        title: activeLanguages.reduce(
            (acc, l) => ({ ...acc, [l]: book?.title?.[l] ?? "" }),
            {}
        ),
        subtitle: activeLanguages.reduce(
            (acc, l) => ({ ...acc, [l]: book?.subtitle?.[l] ?? "" }),
            {}
        ),
        description: activeLanguages.reduce(
            (acc, l) => ({ ...acc, [l]: book?.description?.[l] ?? "" }),
            {}
        ),
        cover_image_url: book?.cover_image_url ?? "",
        buy_link: book?.buy_link ?? "",
        category: book?.category ?? "",
        display_order: book?.display_order ?? 0,
        is_featured: book?.is_featured ?? false,
        status: book?.status ?? "draft",
        _method: isEditing ? "PUT" : "POST",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const route_ = isEditing
            ? route("admin.books.update", book.id)
            : route("admin.books.store");
        post(route_, { preserveScroll: true });
    };

    const tField = (key, lang, label) => (
        <Grid item xs={12} md={4} key={`${key}-${lang}`}>
            <TextField
                fullWidth
                size="small"
                label={`${label} (${lang.toUpperCase()})`}
                value={data[key]?.[lang] ?? ""}
                onChange={(e) =>
                    setData(key, { ...data[key], [lang]: e.target.value })
                }
                error={!!errors[`${key}.${lang}`]}
                helperText={errors[`${key}.${lang}`]}
            />
        </Grid>
    );

    return (
        <>
            <Head title={isEditing ? "Edit Book" : "Add Book"} />
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                    component={InertiaLink}
                    href={route("admin.books.index")}
                    startIcon={<ArrowBackIcon />}
                    size="small"
                >
                    Back
                </Button>
                <Typography variant="h5">
                    {isEditing ? "Edit Book" : "Add Book"}
                </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Title */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Title *
                            </Typography>
                            <Grid container spacing={2}>
                                {activeLanguages.map((l) =>
                                    tField("title", l, "Title")
                                )}
                            </Grid>
                        </Grid>

                        {/* Subtitle */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Subtitle
                            </Typography>
                            <Grid container spacing={2}>
                                {activeLanguages.map((l) =>
                                    tField("subtitle", l, "Subtitle")
                                )}
                            </Grid>
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Description
                            </Typography>
                            <Grid container spacing={2}>
                                {activeLanguages.map((l) => (
                                    <Grid item xs={12} md={4} key={`desc-${l}`}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            multiline
                                            rows={3}
                                            label={`Description (${l.toUpperCase()})`}
                                            value={data.description?.[l] ?? ""}
                                            onChange={(e) =>
                                                setData("description", {
                                                    ...data.description,
                                                    [l]: e.target.value,
                                                })
                                            }
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {/* Cover image URL */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Cover Image URL"
                                value={data.cover_image_url}
                                onChange={(e) =>
                                    setData("cover_image_url", e.target.value)
                                }
                                helperText="Direct URL to the book cover image"
                            />
                        </Grid>

                        {/* Buy link */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Buy / Read Link"
                                value={data.buy_link}
                                onChange={(e) =>
                                    setData("buy_link", e.target.value)
                                }
                            />
                        </Grid>

                        {/* Category tag */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Category Tag"
                                value={data.category}
                                onChange={(e) =>
                                    setData("category", e.target.value)
                                }
                                helperText='e.g. "الأسماء", "الحج", "فقه"'
                            />
                        </Grid>

                        {/* Display order */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Display Order"
                                value={data.display_order}
                                onChange={(e) =>
                                    setData("display_order", Number(e.target.value))
                                }
                            />
                        </Grid>

                        {/* Status */}
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={data.status}
                                    label="Status"
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                </Select>
                                {errors.status && (
                                    <FormHelperText error>
                                        {errors.status}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Featured */}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.is_featured}
                                        onChange={(e) =>
                                            setData(
                                                "is_featured",
                                                e.target.checked
                                            )
                                        }
                                    />
                                }
                                label="Featured"
                            />
                        </Grid>

                        {/* Submit */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                startIcon={<SaveIcon />}
                            >
                                {isEditing ? "Update Book" : "Create Book"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
}

Form.layout = (page) => (
    <AdminLayout children={page} title="Book Form" />
);
