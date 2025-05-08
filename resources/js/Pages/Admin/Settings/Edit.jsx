// Edit file: resources/js/Pages/Admin/Settings/Edit.jsx
import React from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    FormHelperText,
    Divider // <-- Import Divider
} from '@mui/material';

// Define active languages (Ideally fetch from backend props later)
const activeLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'tr', name: 'Turkish' }
];

export default function Edit({ settings }) { // Destructure settings prop

    // Initialize form data
    const siteNameValues = settings?.site_name?.value ?? {};
    // --- Get About Page Content values ---
    const aboutPageContentValues = settings?.about_page_content?.value ?? {};

    const { data, setData, put, processing, errors } = useForm({
        site_name: activeLanguages.reduce((acc, lang) => ({
            ...acc,
            [lang.code]: siteNameValues[lang.code] ?? '' // Get existing value or default ''
        }), {}),
         // --- Initialize about_page_content ---
        about_page_content: activeLanguages.reduce((acc, lang) => ({
            ...acc,
            [lang.code]: aboutPageContentValues[lang.code] ?? ''
        }), {}),
        // Add other setting keys here as needed
        _method: 'PUT', // Specify method for update
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.settings.update'), {
            preserveScroll: true, // Keep scroll on validation error
        });
    };

    // Helper to handle translatable field changes
    const handleTranslatableChange = (e, langCode, fieldName) => {
        setData(fieldName, { ...data[fieldName], [langCode]: e.target.value });
    };

    return (
        <>
            <Head title="Site Settings" />
            <Typography variant="h4" gutterBottom>
                Site Settings
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={3}>

                        {/* Site Name Fields */}
                        <Grid item xs={12}> <Typography variant="h6">General</Typography> </Grid>
                        {activeLanguages.map(lang => (
                            <Grid item xs={12} md={4} key={`site_name-${lang.code}`}>
                                <TextField
                                    required // Backend requires at least one language
                                    fullWidth
                                    id={`site_name-${lang.code}`}
                                    label={`Site Name (${lang.name})`}
                                    name={`site_name[${lang.code}]`} // Use array notation for PHP
                                    value={data.site_name[lang.code]}
                                    onChange={(e) => handleTranslatableChange(e, lang.code, 'site_name')}
                                    error={!!errors[`site_name.${lang.code}`]}
                                    helperText={errors[`site_name.${lang.code}`]}
                                />
                            </Grid>
                        ))}

                        {/* --- Add About Page Content Fields --- */}
                        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
                        <Grid item xs={12}> <Typography variant="h6">About Page</Typography> </Grid>
                         {activeLanguages.map(lang => (
                            <Grid item xs={12} md={4} key={`about_page_content-${lang.code}`}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={10} // Adjust rows as needed
                                    id={`about_page_content-${lang.code}`}
                                    label={`About Page Content (${lang.name})`}
                                    name={`about_page_content[${lang.code}]`}
                                    value={data.about_page_content[lang.code]}
                                    onChange={(e) => handleTranslatableChange(e, lang.code, 'about_page_content')}
                                    error={!!errors[`about_page_content.${lang.code}`]}
                                    helperText={errors[`about_page_content.${lang.code}`] ?? "Enter the main content for the About page here. Basic HTML might be rendered, use with caution until RTE is implemented."}
                                />
                            </Grid>
                        ))}
                        {/* --- End About Page Content Fields --- */}


                        {/* --- Add other settings fields below --- */}
                        {/* Example:
                        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
                        <Grid item xs={12}> <Typography variant="h6">Contact</Typography> </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                id="contact_email"
                                label="Contact Email"
                                name="contact_email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                error={!!errors.contact_email}
                                helperText={errors.contact_email}
                            />
                        </Grid>
                        */}


                        {/* Action Buttons */}
                         <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
}

// Assign Layout
Edit.layout = page => <AdminLayout children={page} title="Site Settings" />;