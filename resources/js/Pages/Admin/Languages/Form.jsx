import React, { useState, useEffect } from "react"; // Added useState, useEffect
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
    Autocomplete, // <-- Import Autocomplete
} from "@mui/material";

export default function Form({ language, knownLanguages }) {
    // language is null when creating, knownLanguages is new prop
    const isEditing = !!language;
    const [selectedKnownLanguage, setSelectedKnownLanguage] = useState(null);
    // Determine if the current language code matches one from the knownLanguages list (on edit)
    // or if a known language has been selected (on create or after selection)
    const isCodeFromKnownList = isEditing
        ? knownLanguages.some((kl) => kl.code === language?.code)
        : !!selectedKnownLanguage;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: language?.code ?? "",
        name: language?.name ?? "",
        native_name: language?.native_name ?? "",
        is_active: language?.is_active ?? true,
        _method: isEditing ? "PUT" : "POST",
    });

    // Effect to populate form if editing an existing language that matches a known one
    useEffect(() => {
        if (isEditing && language) {
            const matchingKnownLanguage = knownLanguages.find(
                (kl) => kl.code === language.code,
            );
            if (matchingKnownLanguage) {
                setSelectedKnownLanguage(matchingKnownLanguage);
                // No need to setData here if language prop already populates data correctly
            }
        }
    }, [isEditing, language, knownLanguages]);

    const handleKnownLanguageChange = (event, newValue) => {
        setSelectedKnownLanguage(newValue);
        if (newValue) {
            setData({
                ...data, // Keep other data like is_active
                code: newValue.code,
                name: newValue.name,
                native_name: newValue.native_name,
            });
        } else {
            // If cleared, allow manual input (optionally reset fields or keep them)
            // For now, we keep them, user can clear manually if they wish to start fresh
            // Or, to reset:
            // setData({
            //     ...data,
            //     code: '',
            //     name: '',
            //     native_name: '',
            // });
        }
    };

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
                        {!isEditing && ( // Show Autocomplete only when creating a new language
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={knownLanguages}
                                    getOptionLabel={(option) =>
                                        `${option.native_name} (${option.name}) - [${option.code}]`
                                    }
                                    value={selectedKnownLanguage}
                                    onChange={handleKnownLanguageChange}
                                    isOptionEqualToValue={(option, value) =>
                                        option.code === value.code
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Choose from common languages (Optional)"
                                            helperText="Selecting a language will pre-fill Code, Name, and Native Name."
                                        />
                                    )}
                                    disabled={processing}
                                />
                            </Grid>
                        )}

                        <Grid
                            item
                            xs={12}
                            sm={isEditing || !selectedKnownLanguage ? 6 : 12}
                        >
                            {" "}
                            {/* Adjust grid based on Autocomplete visibility */}
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
                                    "Short, unique identifier. Cannot be changed after creation if selected from list."
                                }
                                disabled={
                                    isEditing ||
                                    processing ||
                                    (!!selectedKnownLanguage && !isEditing)
                                } // Disabled if editing, or processing, or a known lang is selected on create
                                InputLabelProps={{
                                    shrink:
                                        isEditing || data.code
                                            ? true
                                            : undefined,
                                }}
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
                                disabled={
                                    processing ||
                                    (!!selectedKnownLanguage &&
                                        !isEditing &&
                                        data.code ===
                                            selectedKnownLanguage.code)
                                }
                                InputLabelProps={{
                                    shrink:
                                        isEditing || data.name
                                            ? true
                                            : undefined,
                                }}
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
                                disabled={
                                    processing ||
                                    (!!selectedKnownLanguage &&
                                        !isEditing &&
                                        data.code ===
                                            selectedKnownLanguage.code)
                                }
                                InputLabelProps={{
                                    shrink:
                                        isEditing || data.native_name
                                            ? true
                                            : undefined,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
