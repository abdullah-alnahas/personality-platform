// Create file: resources/js/Pages/Admin/ContentItems/Form.jsx
import React, { useState, useEffect } from 'react';
import { Head, Link as InertiaLink, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Typography, TextField, Button, Paper, Grid, FormControl, InputLabel,
    Select, MenuItem, FormHelperText, Divider, Switch, FormControlLabel, Card,
    CardMedia, Alert, Input, LinearProgress // For file input
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'; // Import DateTimePicker
import dayjs from 'dayjs'; // Needed for DateTimePicker default value parsing

// Define active languages (could also be passed from backend)
const activeLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'tr', name: 'Turkish' }
];

// Helper function to display translated name (using default locale fallback)
const getTranslatedField = (fieldObject, locale = 'en', fallback = '') => {
    if (!fieldObject) return fallback;
    return fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};


export default function Form({ item, categories, featured_image_url }) { // Destructure props
    const isEditing = !!item;
    const [imagePreview, setImagePreview] = useState(featured_image_url || null);

    // Initialize form data
    const { data, setData, post, put, processing, errors, reset, progress } = useForm({
        // Translatable fields
        title: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: item?.title?.[lang.code] ?? '' }), {}),
        content: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: item?.content?.[lang.code] ?? '' }), {}),
        excerpt: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang.code]: item?.excerpt?.[lang.code] ?? '' }), {}),
        // Other fields
        content_category_id: item?.content_category_id ?? '',
        status: item?.status ?? 'draft',
        publish_date: item?.publish_date ? dayjs(item.publish_date) : null, // Use dayjs for DateTimePicker
        is_featured_home: item?.is_featured_home ?? false,
        featured_image: null, // Field for new image upload
        remove_featured_image: false, // Field to signal removal
        _method: isEditing ? 'PUT' : 'POST',
    });

     // Handle image preview
     useEffect(() => {
        if (data.featured_image instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(data.featured_image);
        } else if (!featured_image_url && !data.featured_image) {
             setImagePreview(null); // Clear preview if no image exists or is selected
        } else if (featured_image_url && !data.featured_image && !data.remove_featured_image) {
             setImagePreview(featured_image_url); // Reset to original if selection cleared
        }
     }, [data.featured_image, featured_image_url, data.remove_featured_image]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
             preserveScroll: true,
             onSuccess: () => reset('featured_image'), // Reset file input on success
             onError: (err) => console.error(err),
         };

         // Inertia cannot send File objects with PUT/PATCH, so use POST with _method spoofing
         // Or send as separate request - simpler to use POST for forms with files.
         const routeName = isEditing ? 'admin.content-items.update' : 'admin.content-items.store';
         const routeParams = isEditing ? item.id : [];

         // Convert Dayjs object back to string or null before sending
         const dataToSend = {
            ...data,
            publish_date: data.publish_date ? data.publish_date.toISOString() : null,
         };


        // Use post even for update when sending files
         router.post(route(routeName, routeParams), dataToSend, options);

        // // Alternative if not sending files or handling files separately:
        // if (isEditing) {
        //      put(route('admin.content-items.update', item.id), dataToSend, options);
        // } else {
        //      post(route('admin.content-items.store'), dataToSend, options);
        // }
    };

    // Helper to handle translatable field changes
    const handleTranslatableChange = (e, langCode, fieldName) => {
        setData(fieldName, { ...data[fieldName], [langCode]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
             setData('featured_image', e.target.files[0]);
             setData('remove_featured_image', false); // Ensure remove flag is off if new file selected
        }
     };

     const handleRemoveImage = () => {
         setData({
             ...data,
             featured_image: null,
             remove_featured_image: true,
         });
         setImagePreview(null);
     };

    return (
        <>
            <Head title={isEditing ? 'Edit Content Item' : 'Create Content Item'} />
            <Typography variant="h4" gutterBottom>
                {isEditing ? `Edit Item: ${getTranslatedField(item.title)}` : 'Create New Content Item'}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} encType="multipart/form-data">
                    <Grid container spacing={3}>

                        {/* Translatable Title Fields */}
                        {activeLanguages.map(lang => (
                            <Grid xs={12} md={4} key={`title-${lang.code}`}>
                                <TextField required fullWidth id={`title-${lang.code}`} label={`Title (${lang.name})`}
                                    name={`title[${lang.code}]`} value={data.title[lang.code]}
                                    onChange={(e) => handleTranslatableChange(e, lang.code, 'title')}
                                    error={!!errors[`title.${lang.code}`]} helperText={errors[`title.${lang.code}`]}
                                />
                            </Grid>
                        ))}

                       <Grid xs={12}><Divider>Content & Details</Divider></Grid>

                        {/* Translatable Excerpt Fields */}
                         {activeLanguages.map(lang => (
                             <Grid xs={12} md={4} key={`excerpt-${lang.code}`}>
                                 <TextField fullWidth multiline rows={3} id={`excerpt-${lang.code}`} label={`Excerpt (${lang.name})`}
                                     name={`excerpt[${lang.code}]`} value={data.excerpt[lang.code]}
                                     onChange={(e) => handleTranslatableChange(e, lang.code, 'excerpt')}
                                     error={!!errors[`excerpt.${lang.code}`]} helperText={errors[`excerpt.${lang.code}`]}
                                 />
                             </Grid>
                         ))}

                         {/* Translatable Content Fields (Basic Textarea Placeholder) */}
                         {activeLanguages.map(lang => (
                             <Grid xs={12} md={4} key={`content-${lang.code}`}>
                                 <TextField fullWidth multiline rows={10} id={`content-${lang.code}`} label={`Content (${lang.name}) - (RTE later)`}
                                     name={`content[${lang.code}]`} value={data.content[lang.code]}
                                     onChange={(e) => handleTranslatableChange(e, lang.code, 'content')}
                                     error={!!errors[`content.${lang.code}`]} helperText={errors[`content.${lang.code}`]}
                                 />
                             </Grid>
                         ))}

                         <Grid xs={12}><Divider>Configuration</Divider></Grid>

                         {/* Category Select */}
                         <Grid xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.content_category_id}>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select labelId="category-label" id="content_category_id" name="content_category_id"
                                    value={data.content_category_id} label="Category" required
                                    onChange={(e) => setData('content_category_id', e.target.value)} >
                                    <MenuItem value=""><em>Select Category</em></MenuItem>
                                    {categories.map(cat => (
                                        <MenuItem key={cat.id} value={cat.id}>{getTranslatedField(cat.name)}</MenuItem>
                                    ))}
                                </Select>
                                {errors.content_category_id && <FormHelperText>{errors.content_category_id}</FormHelperText>}
                            </FormControl>
                         </Grid>

                        {/* Status Select */}
                        <Grid xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.status}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select labelId="status-label" id="status" name="status" value={data.status} label="Status" required
                                    onChange={(e) => setData('status', e.target.value)} >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                </Select>
                                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        {/* Publish Date Picker */}
                         <Grid xs={12} sm={6} md={4}>
                             <DateTimePicker
                                 label="Publish Date/Time"
                                 value={data.publish_date} // Expects Dayjs object or null
                                 onChange={(newValue) => setData('publish_date', newValue)}
                                 slotProps={{ textField: { fullWidth: true, error: !!errors.publish_date, helperText: errors.publish_date } }}
                             />
                         </Grid>

                        {/* Featured Switch */}
                        <Grid xs={12} sm={6} md={4}>
                           <FormControlLabel control={
                                    <Switch checked={data.is_featured_home}
                                        onChange={(e) => setData('is_featured_home', e.target.checked)}
                                        name="is_featured_home" />
                                    }
                                label="Feature on Homepage?" />
                            {errors.is_featured_home && <FormHelperText error>{errors.is_featured_home}</FormHelperText>}
                        </Grid>

                         <Grid xs={12}><Divider>Featured Image</Divider></Grid>

                          {/* Image Preview and Upload */}
                          <Grid xs={12} md={6}>
                             <FormControl fullWidth error={!!errors.featured_image}>
                                 <InputLabel shrink htmlFor="featured_image_input" sx={{ position: 'static', mb: 1}}>
                                     Featured Image (Max 2MB)
                                 </InputLabel>
                                 <Input
                                     accept="image/*"
                                     id="featured_image_input"
                                     type="file"
                                     onChange={handleFileChange}
                                     sx={{ display: 'block' }} // Use sx for better control
                                 />
                                  {progress && (
                                    <Box sx={{ width: '100%', mt: 1 }}>
                                        <LinearProgress variant="determinate" value={progress.percentage} />
                                        <Typography variant="caption">{progress.percentage}%</Typography>
                                    </Box>
                                    )}
                                 {errors.featured_image && <FormHelperText>{errors.featured_image}</FormHelperText>}
                             </FormControl>
                         </Grid>
                         <Grid xs={12} md={6}>
                             {imagePreview && (
                                 <Card sx={{ maxWidth: 300, position: 'relative' }}>
                                     <CardMedia component="img" image={imagePreview} alt="Featured Image Preview" height="150"/>
                                     <Button size="small" color="error" onClick={handleRemoveImage} sx={{position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(255,255,255,0.7)'}}>Remove</Button>
                                 </Card>
                             )}
                             {/* Hidden input to track removal if needed separately */}
                             {isEditing && featured_image_url && <input type="hidden" name="remove_featured_image" value={data.remove_featured_image ? '1' : '0'} />}
                         </Grid>


                        {/* Action Buttons */}
                        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button component={InertiaLink} href={route('admin.content-items.index')} variant="outlined" disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={processing}>
                                {processing ? 'Saving...' : (isEditing ? 'Update Item' : 'Create Item')}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
}

// Assign Layout
Form.layout = page => <AdminLayout children={page} title={page.props.item ? 'Edit Content Item' : 'Create Content Item'} />;