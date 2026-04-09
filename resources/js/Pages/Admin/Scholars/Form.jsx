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
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const LANGS = ["ar", "en", "tr"];

export default function Form({ scholar }) {
    const isEditing = !!scholar;
    const { props } = usePage();
    const activeLanguages = props.activeLanguages || LANGS;

    const { data, setData, post, processing, errors } = useForm({
        name: activeLanguages.reduce(
            (acc, l) => ({ ...acc, [l]: scholar?.name?.[l] ?? "" }),
            {}
        ),
        group_name: activeLanguages.reduce(
            (acc, l) => ({ ...acc, [l]: scholar?.group_name?.[l] ?? "" }),
            {}
        ),
        group_key: scholar?.group_key ?? "",
        bio: activeLanguages.reduce(
            (acc, l) => ({ ...acc, [l]: scholar?.bio?.[l] ?? "" }),
            {}
        ),
        photo_url: scholar?.photo_url ?? "",
        display_order: scholar?.display_order ?? 0,
        status: scholar?.status ?? "published",
        _method: isEditing ? "PUT" : "POST",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const route_ = isEditing
            ? route("admin.scholars.update", scholar.id)
            : route("admin.scholars.store");
        post(route_, { preserveScroll: true });
    };

    const translatableRow = (key, label, multiline = false) => (
        <Grid item xs={12} key={key}>
            <Typography variant="subtitle2" gutterBottom>
                {label}
            </Typography>
            <Grid container spacing={2}>
                {activeLanguages.map((l) => (
                    <Grid item xs={12} md={4} key={`${key}-${l}`}>
                        <TextField
                            fullWidth
                            size="small"
                            multiline={multiline}
                            rows={multiline ? 2 : 1}
                            label={`${label} (${l.toUpperCase()})`}
                            value={data[key]?.[l] ?? ""}
                            onChange={(e) =>
                                setData(key, {
                                    ...data[key],
                                    [l]: e.target.value,
                                })
                            }
                            error={!!errors[`${key}.${l}`]}
                            helperText={errors[`${key}.${l}`]}
                        />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );

    return (
        <>
            <Head title={isEditing ? "Edit Scholar" : "Add Scholar"} />
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                    component={InertiaLink}
                    href={route("admin.scholars.index")}
                    startIcon={<ArrowBackIcon />}
                    size="small"
                >
                    Back
                </Button>
                <Typography variant="h5">
                    {isEditing ? "Edit Scholar" : "Add Scholar"}
                </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {translatableRow("name", "Name *")}
                        {translatableRow("group_name", "Group / Region Name")}

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                required
                                size="small"
                                label="Group Key (machine-readable)"
                                value={data.group_key}
                                onChange={(e) =>
                                    setData("group_key", e.target.value)
                                }
                                helperText='e.g. "jordan", "yemen", "hejaz"'
                                error={!!errors.group_key}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
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

                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={data.status}
                                    label="Status"
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <MenuItem value="published">Published</MenuItem>
                                    <MenuItem value="draft">Draft</MenuItem>
                                </Select>
                                {errors.status && (
                                    <FormHelperText error>
                                        {errors.status}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Photo URL (optional)"
                                value={data.photo_url}
                                onChange={(e) => setData("photo_url", e.target.value)}
                                helperText="Link to scholar's portrait image"
                                error={!!errors.photo_url}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {translatableRow("bio", "Short Bio / Credentials", true)}

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                startIcon={<SaveIcon />}
                            >
                                {isEditing ? "Update Scholar" : "Create Scholar"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
}

Form.layout = (page) => (
    <AdminLayout children={page} title="Scholar Form" />
);
