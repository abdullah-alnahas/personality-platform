import React from 'react';
import { Head, Link as InertiaLink, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Typography, TextField, Button, Paper, Grid, FormControl, InputLabel,
    Select, MenuItem, FormHelperText, Divider
} from '@mui/material';

// Define active languages (Ideally fetch from backend props later)
const activeLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'tr', name: 'Turkish' }
];

// Helper function to display translated name
const getTranslatedField = (fieldObject, locale = 'en', fallback = '') => {
    if (!fieldObject) return fallback;
    return fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};

// Supported platforms - keep in sync with backend request validation
const platforms = ['facebook', 'instagram', 'youtube', 'telegram', 'x', 'twitter', 'linkedin', 'tiktok', 'other'];


export default function Form({ account }) { // Destructure account prop
    const isEditing = !!account;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        account_name: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: account?.account_name?.[lang.code] ?? '' }), {}),
        platform: account?.platform ?? 'other',
        url: account?.url ?? '',
        display_order: account?.display_order ?? 0,
        status: account?.status ?? 'active',
        _method: isEditing ? 'PUT' : 'POST',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = isEditing ? 'admin.social-accounts.update' : 'admin.social-accounts.store';
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
            <Head title={isEditing ? 'Edit Social Account' : 'Create Social Account'} />
            <Typography variant="h4" gutterBottom>
                {isEditing ? `Edit Account: ${getTranslatedField(account.account_name) || account.platform}` : 'Create New Social Account'}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={3}>

                        {/* Platform Select */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.platform}>
                                <InputLabel id="platform-label">Platform</InputLabel>
                                <Select
                                    labelId="platform-label"
                                    id="platform"
                                    name="platform"
                                    value={data.platform}
                                    label="Platform"
                                    required
                                    onChange={(e) => setData('platform', e.target.value)}
                                >
                                    {platforms.map(p => (
                                        <MenuItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>
                                    ))}
                                </Select>
                                {errors.platform && <FormHelperText>{errors.platform}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        {/* URL Field */}
                        <Grid item xs={12} sm={6} md={8}>
                            <TextField
                                required
                                fullWidth
                                id="url"
                                label="Profile/Channel URL"
                                name="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                error={!!errors.url}
                                helperText={errors.url ?? "Enter the full URL (e.g., https://...)"}
                                type="url"
                            />
                        </Grid>

                        <Grid item xs={12}><Divider>Optional Details</Divider></Grid>


                        {/* Translatable Account Name Fields */}
                        {activeLanguages.map(lang => (
                            <Grid item xs={12} md={4} key={`account_name-${lang.code}`}>
                                <TextField
                                    fullWidth
                                    id={`account_name-${lang.code}`}
                                    label={`Account Name (${lang.name})`}
                                    name={`account_name[${lang.code}]`}
                                    value={data.account_name[lang.code]}
                                    onChange={(e) => handleTranslatableChange(e, lang.code, 'account_name')}
                                    error={!!errors[`account_name.${lang.code}`]}
                                    helperText={errors[`account_name.${lang.code}`] ?? "Optional (e.g., Personal, Institute)"}
                                />
                            </Grid>
                        ))}

                        {/* Display Order Field */}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                id="display_order"
                                label="Display Order"
                                name="display_order"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={data.display_order}
                                onChange={(e) => setData('display_order', e.target.value)}
                                error={!!errors.display_order}
                                helperText={errors.display_order ?? "Lower numbers appear first."}
                            />
                        </Grid>

                        {/* Status Field */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.status}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    label="Status"
                                    required
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                            </FormControl>
                        </Grid>


                        {/* Action Buttons */}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button component={InertiaLink} href={route('admin.social-accounts.index')} variant="outlined" disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={processing}>
                                {processing ? 'Saving...' : (isEditing ? 'Update Account' : 'Create Account')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
}

Form.layout = page => <AdminLayout children={page} title={page.props.account ? 'Edit Social Account' : 'Create Social Account'} />;
