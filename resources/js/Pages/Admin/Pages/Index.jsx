import React, { useState } from 'react';
import { Head, Link as InertiaLink, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Typography, Button, Paper, Chip, Link, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';

const getTranslatedField = (fieldObject, locale = 'en', fallback = 'N/A') => {
    if (!fieldObject) return fallback;
    return fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};

export default function Index({ pages, can }) {
    const { data, links, current_page, per_page, total } = pages;
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '' });

    const openDeleteDialog = (id, title) => {
        setDeleteDialog({ open: true, id, title });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog({ open: false, id: null, title: '' });
    };

    const handleDeleteConfirm = () => {
        router.delete(route('admin.pages.destroy', deleteDialog.id), {
            preserveScroll: true,
            onSuccess: () => closeDeleteDialog(),
        });
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'title_en',
            headerName: 'Title',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <Link component={InertiaLink} href={route('admin.pages.edit', params.row.id)} underline="hover">
                    {getTranslatedField(params.row.title)}
                </Link>
            ),
        },
        { field: 'slug', headerName: 'Slug', width: 180 },
        {
            field: 'status',
            headerName: 'Status',
            width: 110,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'published' ? 'success' : 'default'}
                    size="small"
                />
            ),
        },
        {
            field: 'is_homepage',
            headerName: 'Homepage',
            width: 110,
            renderCell: (params) => (
                params.value ? (
                    <Chip icon={<HomeIcon />} label="Yes" color="primary" size="small" />
                ) : (
                    <Chip label="No" size="small" variant="outlined" />
                )
            ),
        },
        {
            field: 'blocks_count',
            headerName: 'Blocks',
            width: 90,
            renderCell: (params) => params.value ?? 0,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id, row }) => [
                <GridActionsCellItem
                    key={`edit-${id}`}
                    icon={<Tooltip title="Edit Page"><EditIcon /></Tooltip>}
                    label="Edit"
                    component={InertiaLink}
                    href={route('admin.pages.edit', id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    key={`delete-${id}`}
                    icon={<Tooltip title="Delete Page"><DeleteIcon /></Tooltip>}
                    label="Delete"
                    onClick={() => openDeleteDialog(id, getTranslatedField(row.title))}
                    color="error"
                />,
            ],
        },
    ];

    const rows = data.map(item => ({
        ...item,
        title_en: getTranslatedField(item.title, 'en', ''),
    }));

    return (
        <>
            <Head title="Pages" />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Pages</Typography>
                <Button
                    variant="contained"
                    component={InertiaLink}
                    href={route('admin.pages.create')}
                    startIcon={<AddIcon />}
                >
                    Create Page
                </Button>
            </Box>

            <Paper sx={{ height: 'calc(100vh - 220px)', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[15, 30, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: per_page, page: current_page - 1 },
                        },
                    }}
                    rowCount={total}
                    paginationMode="server"
                    onPaginationModelChange={(model) => {
                        router.get(route('admin.pages.index'), {
                            page: model.page + 1,
                            perPage: model.pageSize,
                        }, { preserveState: true, replace: true });
                    }}
                    disableRowSelectionOnClick
                    autoHeight={false}
                    sx={{ border: 0 }}
                />
            </Paper>

            {links.length > 3 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {links.map((link, index) => (
                            <Button
                                key={index}
                                component={InertiaLink}
                                href={link.url}
                                disabled={!link.url}
                                size="small"
                                variant={link.active ? 'contained' : 'outlined'}
                            >
                                <span>{link.label.replace(/&laquo;/g, '\u00AB').replace(/&raquo;/g, '\u00BB')}</span>
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}

            <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the page &quot;{deleteDialog.title}&quot;? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

Index.layout = page => <AdminLayout children={page} title="Pages" />;
