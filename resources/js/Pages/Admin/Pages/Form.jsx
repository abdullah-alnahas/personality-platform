import React, { useState, useEffect } from 'react';
import { Head, Link as InertiaLink, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Typography, TextField, Button, Paper, Grid,
    FormControl, InputLabel, Select, MenuItem, FormHelperText,
    Divider, Switch, FormControlLabel, Chip, IconButton, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const getTranslatedFieldLocal = (fieldObject, pageProps, localeKeyToUse = 'en', fallback = '') => {
    const currentLocale = pageProps.locale || localeKeyToUse;
    if (!fieldObject) return fallback;
    if (typeof fieldObject !== 'object' || fieldObject === null) return String(fieldObject) || fallback;
    return fieldObject[currentLocale] || fieldObject[localeKeyToUse] || Object.values(fieldObject)[0] || fallback;
};

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

export default function Form({ page, activeLanguages: controllerActiveLanguages }) {
    const isEditing = !!page;
    const { props: pageProps } = usePage();
    const activeLanguages =
        Array.isArray(controllerActiveLanguages) && controllerActiveLanguages.every(lang => typeof lang === 'string')
            ? controllerActiveLanguages
            : ['en', 'ar', 'tr'];

    const [autoSlug, setAutoSlug] = useState(!isEditing);
    const [deleteBlockDialog, setDeleteBlockDialog] = useState({ open: false, blockId: null });

    const { data, setData, post, processing, errors } = useForm({
        title: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang]: page?.title?.[lang] ?? '' }), {}),
        slug: page?.slug ?? '',
        status: page?.status ?? 'draft',
        layout: page?.layout ?? 'default',
        is_homepage: page?.is_homepage ?? false,
        _method: isEditing ? 'PUT' : 'POST',
    });

    useEffect(() => {
        if (autoSlug && data.title) {
            const primaryLang = pageProps.locale || 'en';
            const titleText = data.title[primaryLang] || data.title['en'] || Object.values(data.title).find(v => v) || '';
            if (titleText) {
                setData('slug', slugify(titleText));
            }
        }
    }, [data.title, autoSlug, pageProps.locale]);

    const blocks = page?.blocks ?? [];

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = isEditing ? 'admin.pages.update' : 'admin.pages.store';
        const routeParams = isEditing ? page.id : [];
        post(route(routeName, routeParams), {
            preserveScroll: true,
        });
    };

    const handleTranslatableChange = (fieldName, langCode, valueOrEvent) => {
        let newValue;
        if (valueOrEvent && typeof valueOrEvent === 'object' && valueOrEvent.target) {
            newValue = valueOrEvent.target.value;
        } else {
            newValue = valueOrEvent;
        }
        setData(fieldName, { ...data[fieldName], [langCode]: newValue });
    };

    const handleSlugChange = (e) => {
        setAutoSlug(false);
        setData('slug', e.target.value);
    };

    const handleReorder = (blockId, direction) => {
        const sorted = [...blocks].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
        const idx = sorted.findIndex(b => b.id === blockId);
        if (idx < 0) return;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return;

        const reordered = sorted.map((b, i) => {
            if (i === idx) return { id: b.id, display_order: swapIdx };
            if (i === swapIdx) return { id: b.id, display_order: idx };
            return { id: b.id, display_order: i };
        });

        fetch(route('admin.pages.blocks.reorder', page.id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ blocks: reordered }),
        }).then(() => {
            router.reload({ only: ['page'] });
        });
    };

    const handleDeleteBlock = () => {
        router.delete(route('admin.pages.blocks.destroy', [page.id, deleteBlockDialog.blockId]), {
            preserveScroll: true,
            onSuccess: () => setDeleteBlockDialog({ open: false, blockId: null }),
        });
    };

    return (
        <>
            <Head title={isEditing ? 'Edit Page' : 'Create Page'} />
            <Typography variant="h4" gutterBottom>
                {isEditing
                    ? `Edit Page: ${getTranslatedFieldLocal(page.title, pageProps)}`
                    : 'Create New Page'}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={3}>
                        {activeLanguages.map((lang) => (
                            <Grid item xs={12} md={activeLanguages.length > 1 ? 4 : 12} key={`title-${lang}`}>
                                <TextField
                                    required={lang === (pageProps.locale || 'en')}
                                    fullWidth
                                    id={`title-${lang}`}
                                    label={`Title (${lang.toUpperCase()})`}
                                    name={`title[${lang}]`}
                                    value={data.title[lang]}
                                    onChange={(e) => handleTranslatableChange('title', lang, e)}
                                    error={!!errors[`title.${lang}`]}
                                    helperText={errors[`title.${lang}`]}
                                />
                            </Grid>
                        ))}

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                required
                                fullWidth
                                id="slug"
                                label="Slug"
                                name="slug"
                                value={data.slug}
                                onChange={handleSlugChange}
                                error={!!errors.slug}
                                helperText={errors.slug || (autoSlug ? 'Auto-generated from title' : 'Manually set')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider>Configuration</Divider>
                        </Grid>

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
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                </Select>
                                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.layout}>
                                <InputLabel id="layout-label">Layout</InputLabel>
                                <Select
                                    labelId="layout-label"
                                    id="layout"
                                    name="layout"
                                    value={data.layout}
                                    label="Layout"
                                    onChange={(e) => setData('layout', e.target.value)}
                                >
                                    <MenuItem value="default">Default</MenuItem>
                                    <MenuItem value="full-width">Full Width</MenuItem>
                                    <MenuItem value="landing">Landing</MenuItem>
                                </Select>
                                {errors.layout && <FormHelperText>{errors.layout}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.is_homepage}
                                        onChange={(e) => setData('is_homepage', e.target.checked)}
                                        name="is_homepage"
                                    />
                                }
                                label="Set as Homepage"
                            />
                            {errors.is_homepage && <FormHelperText error>{errors.is_homepage}</FormHelperText>}
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button
                                component={InertiaLink}
                                href={route('admin.pages.index')}
                                variant="outlined"
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={processing}>
                                {processing ? 'Saving...' : isEditing ? 'Update Page' : 'Create Page'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {isEditing && (
                <Paper sx={{ p: 3, mt: 3 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5">Blocks</Typography>
                        <Button
                            variant="contained"
                            component={InertiaLink}
                            href={route('admin.pages.blocks.create', page.id)}
                            startIcon={<AddIcon />}
                            size="small"
                        >
                            Add Block
                        </Button>
                    </Box>

                    {blocks.length === 0 ? (
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                            No blocks added yet. Click "Add Block" to get started.
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={60}>Order</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell width={100}>Status</TableCell>
                                        <TableCell width={120}>Reorder</TableCell>
                                        <TableCell width={100} align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {blocks.map((block, index) => (
                                        <TableRow key={block.id}>
                                            <TableCell>{block.display_order ?? index + 1}</TableCell>
                                            <TableCell>
                                                <Chip label={block.block_type_label || block.block_type} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={block.status}
                                                    color={block.status === 'published' ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    disabled={index === 0}
                                                    onClick={() => handleReorder(block.id, 'up')}
                                                >
                                                    <ArrowUpwardIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    disabled={index === blocks.length - 1}
                                                    onClick={() => handleReorder(block.id, 'down')}
                                                >
                                                    <ArrowDownwardIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit Block">
                                                    <IconButton
                                                        size="small"
                                                        component={InertiaLink}
                                                        href={route('admin.pages.blocks.edit', [page.id, block.id])}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Block">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => setDeleteBlockDialog({ open: true, blockId: block.id })}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            )}

            <Dialog open={deleteBlockDialog.open} onClose={() => setDeleteBlockDialog({ open: false, blockId: null })}>
                <DialogTitle>Confirm Block Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this block? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteBlockDialog({ open: false, blockId: null })}>Cancel</Button>
                    <Button onClick={handleDeleteBlock} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

Form.layout = (page) => (
    <AdminLayout
        children={page}
        title={page.props?.page ? 'Edit Page' : 'Create Page'}
    />
);
