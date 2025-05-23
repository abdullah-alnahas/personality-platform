import React from "react";
import { Head, Link as InertiaLink, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Switch,
    FormControlLabel,
    FormHelperText,
} from "@mui/material";

export default function Form({ language }) {
    const isEditing = !!language;

    const { data, setData, post, put, processing, errors } = useForm({
        // Removed reset as it's not used
        code: language?.code ?? "",
        name: language?.name ?? "",
        native_name: language?.native_name ?? "",
        is_active: language?.is_active ?? true,
        // is_rtl: language?.is_rtl ?? false, // REMOVED - will be inferred
        _method: isEditing ? "PUT" : "POST",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route("admin.languages.update", language.code), {
                preserveScroll: true,
            });
        } else {
            post(route("admin.languages.store"), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head
                title={
                    isEditing
                        ? `Edit Language: ${language.name}`
                        : "Create New Language"
                }
            />
            <Typography variant="h4" gutterBottom>
                {isEditing
                    ? `Edit Language: ${language.name}`
                    : "Create New Language"}
            </Typography>

            <Paper sx={{ p: 3, maxWidth: "lg", mx: "auto" }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="code"
                                label="Language Code (e.g., en, ar-SA)"
                                name="code"
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                error={!!errors.code}
                                helperText={
                                    errors.code ||
                                    "Short, unique identifier (e.g., 'en', 'fr', 'ar-EG'). Cannot be changed after creation."
                                }
                                disabled={isEditing || processing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="Common Name (e.g., English, Arabic)"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                error={!!errors.name}
                                helperText={errors.name}
                                disabled={processing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="native_name"
                                label="Native Name (e.g., English, العربية, Türkçe)"
                                name="native_name"
                                value={data.native_name}
                                onChange={(e) =>
                                    setData("native_name", e.target.value)
                                }
                                error={!!errors.native_name}
                                helperText={errors.native_name}
                                disabled={processing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {" "}
                            {/* Adjusted grid size */}
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                "is_active",
                                                e.target.checked,
                                            )
                                        }
                                        name="is_active"
                                        disabled={processing}
                                    />
                                }
                                label="Active"
                            />
                            {errors.is_active && (
                                <FormHelperText error>
                                    {errors.is_active}
                                </FormHelperText>
                            )}
                        </Grid>
                        {/* is_rtl Switch removed */}

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
                                href={route("admin.languages.index")}
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
                                      ? "Update Language"
                                      : "Create Language"}
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
        title={page.props.language ? "Edit Language" : "Create Language"}
    />
);
