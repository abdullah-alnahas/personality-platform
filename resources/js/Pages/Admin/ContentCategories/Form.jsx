// resources/js/Pages/Admin/ContentCategories/Form.jsx
import React from 'react';
import { Head, Link as InertiaLink, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
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
    Divider
} from '@mui/material';

// Define active languages (could also be passed from backend)
const activeLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'tr', name: 'Turkish' }
];

export default function Form({ category /* , languages */ }) { // Destructure category prop
    const isEditing = !!category; // Check if we are editing (category object exists)

    // Initialize form data using useForm hook
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: category?.name?.[lang.code] ?? '' }), {}),
        description: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: category?.description?.[lang.code] ?? '' }), {}),
        quote: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: category?.quote?.[lang.code] ?? '' }), {}),
        // meta_fields: category?.meta_fields ?? {}, // Add later if needed
        icon: category?.icon ?? '',
        order: category?.order ?? 0,
        status: category?.status ?? 'published', // Default status
        _method: isEditing ? 'PUT' : 'POST', // Method spoofing for PUT
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            // Use put for updates, Inertia handles method spoofing automatically with _method:'PUT'
            // router.put(route('admin.content-categories.update', category.id), data ... ) - useForm is simpler
             put(route('admin.content-categories.update', category.id), {
                 preserveScroll: true, // Keep scroll position on error
                 // onSuccess: () => reset(), // Optionally reset form on success
             });
        } else {
            post(route('admin.content-categories.store'), {
                preserveScroll: true,
                // onSuccess: () => reset(),
            });
        }
    };

    // Helper to handle translatable field changes
    const handleTranslatableChange = (e, langCode, fieldName) => {
        setData(fieldName, { ...data[fieldName], [langCode]: e.target.value });
    };


    return (
        <>
            <Head title={isEditing ? 'Edit Category' : 'Create Category'} />
            <Typography variant="h4" gutterBottom>
                {isEditing ? `Edit Category: ${getTranslatedName(category.name)}` : 'Create New Category'}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={3}>

                        {/* Translatable Name Fields */}
                        {activeLanguages.map(lang => (
                             <Grid xs={12} md={4} key={`name-${lang.code}`}>
                                <TextField
                                    required // Make default locale required implicitly by backend validation
                                    fullWidth
                                    id={`name-${lang.code}`}
                                    label={`Name (${lang.name})`}
                                    name={`name[${lang.code}]`} // Use array notation for PHP
                                    value={data.name[lang.code]}
                                    onChange={(e) => handleTranslatableChange(e, lang.code, 'name')}
                                    error={!!errors[`name.${lang.code}`]}
                                    helperText={errors[`name.${lang.code}`]}
                                />
                            </Grid>
                        ))}

                         <Grid xs={12}><Divider>Optional Details</Divider></Grid>

                         {/* Translatable Description Fields */}
                        {activeLanguages.map(lang => (
                             <Grid xs={12} md={4} key={`desc-${lang.code}`}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    id={`description-${lang.code}`}
                                    label={`Description (${lang.name})`}
                                    name={`description[${lang.code}]`}
                                    value={data.description[lang.code]}
                                     onChange={(e) => handleTranslatableChange(e, lang.code, 'description')}
                                    error={!!errors[`description.${lang.code}`]}
                                    helperText={errors[`description.${lang.code}`]}
                                />
                            </Grid>
                        ))}

                         {/* Translatable Quote Fields */}
                         {activeLanguages.map(lang => (
                             <Grid xs={12} md={4} key={`quote-${lang.code}`}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    id={`quote-${lang.code}`}
                                    label={`Quote (${lang.name})`}
                                    name={`quote[${lang.code}]`}
                                    value={data.quote[lang.code]}
                                     onChange={(e) => handleTranslatableChange(e, lang.code, 'quote')}
                                    error={!!errors[`quote.${lang.code}`]}
                                    helperText={errors[`quote.${lang.code}`]}
                                />
                            </Grid>
                        ))}

                        <Grid xs={12}><Divider>Configuration</Divider></Grid>

                         {/* Icon Field */}
                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="icon"
                                label="Icon (e.g., MUI Icon Name)"
                                name="icon"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                error={!!errors.icon}
                                helperText={errors.icon}
                             />
                        </Grid>

                        {/* Order Field */}
                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="order"
                                label="Display Order"
                                name="order"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={data.order}
                                onChange={(e) => setData('order', e.target.value)}
                                error={!!errors.order}
                                helperText={errors.order ?? "Lower numbers appear first."}
                             />
                        </Grid>

                         {/* Status Field */}
                         <Grid xs={12} sm={4}>
                             <FormControl fullWidth error={!!errors.status}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    label="Status"
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <MenuItem value="published">Published</MenuItem>
                                    <MenuItem value="draft">Draft</MenuItem>
                                </Select>
                                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                            </FormControl>
                         </Grid>


                        {/* Action Buttons */}
                        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                             <Button
                                 component={InertiaLink}
                                 href={route('admin.content-categories.index')}
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
                                {processing ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
}

// Assign Layout
Form.layout = page => <AdminLayout children={page} title={page.props.category ? 'Edit Category' : 'Create Category'} />;

// Helper function (can be moved to a utility file)
const getTranslatedName = (nameObject, defaultLocale = 'en') => {
     if (!nameObject) return '';
     return nameObject[defaultLocale] || Object.values(nameObject)[0] || '';
};