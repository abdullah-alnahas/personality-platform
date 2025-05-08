// Edit file: resources/js/Pages/Admin/NavigationItems/Index.jsx
import React from 'react';
import { Head, Link as InertiaLink, router, usePage } from '@inertiajs/react'; // Import usePage
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Typography, Button, Paper, IconButton, Chip, Link as MuiLink, Tooltip
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LaunchIcon from '@mui/icons-material/Launch';

// ** UPDATED Helper function (More Robust) **
const getTranslatedField = (fieldObject, locale = 'en', fallback = '') => {
    // Immediately return fallback if fieldObject is null or undefined
    if (fieldObject == null) {
        return fallback;
    }
    // If it's not an object (e.g., already a simple string), return it directly or fallback
    if (typeof fieldObject !== 'object') {
        return String(fieldObject) || fallback; // Ensure it's a string
    }
    // If it is an object, attempt to get the translation
    // Note: usePage().props.locale relies on locale being shared in HandleInertiaRequests
    const currentLocale = usePage().props.locale || locale;
    return fieldObject[currentLocale] || fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};

export default function Index({ items, can }) {
    const { data, links, current_page, per_page, total } = items;

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this navigation item? This may also delete child items depending on database constraints.')) {
            router.delete(route('admin.navigation-items.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'label_en',
            headerName: 'Label (EN)',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <MuiLink component={InertiaLink} href={route('admin.navigation-items.edit', params.row.id)} underline="hover">
                    {getTranslatedField(params.row.label)}
                </MuiLink>
            )
        },
        { field: 'menu_location', headerName: 'Location', width: 120 },
        {
            field: 'url',
            headerName: 'URL',
            flex: 1,
            minWidth: 200,
            renderCell: (params) => (
                <MuiLink href={params.value} target={params.row.target} rel="noopener noreferrer" underline="hover" sx={{display: 'flex', alignItems: 'center'}}>
                    {params.value}
                    {params.row.target === '_blank' && <LaunchIcon fontSize="inherit" sx={{ ml: 0.5, fontSize: '0.8rem' }} />}
                </MuiLink>
            )
         },
        // ** More Robust valueGetter **
        {
            field: 'parent_label_en',
            headerName: 'Parent',
            width: 150,
            // Check if params and params.row exist before accessing properties
            valueGetter: (params) => params?.row ? getTranslatedField(params.row.parent?.label, 'en', '') : '',
        },
        { field: 'order', headerName: 'Order', width: 80 },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'published' ? 'success' : 'default'}
                    size="small"
                />
            )
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => [
                <GridActionsCellItem
                    key={`edit-${id}`}
                    icon={<Tooltip title="Edit Item"><EditIcon /></Tooltip>}
                    label="Edit"
                    component={InertiaLink}
                    href={route('admin.navigation-items.edit', id)}
                    color="inherit"
                    disabled={!can?.edit}
                />,
                <GridActionsCellItem
                    key={`delete-${id}`}
                    icon={<Tooltip title="Delete Item"><DeleteIcon /></Tooltip>}
                    label="Delete"
                    onClick={() => handleDelete(id)}
                    color="error"
                    disabled={!can?.delete}
                />,
            ],
        },
    ];

    // Prepare rows, adding extracted label for potential sorting/filtering
    const rows = data.map(item => ({
        ...item,
        label_en: getTranslatedField(item.label, 'en', ''), // Use updated helper
    }));

     // Handle pagination changes for DataGrid
     const handlePaginationChange = (paginationModel) => {
        router.get(route('admin.navigation-items.index'), {
            page: paginationModel.page + 1, // DataGrid is 0-indexed, Laravel Paginator is 1-indexed
            perPage: paginationModel.pageSize,
        }, { preserveState: true, replace: true });
    };


    return (
        <>
            <Head title="Navigation Items" />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Navigation Items</Typography>
                {can?.create && (
                    <Button
                        variant="contained"
                        component={InertiaLink}
                        href={route('admin.navigation-items.create')}
                        startIcon={<AddIcon />}
                    >
                        Create Item
                    </Button>
                )}
            </Box>

            {/* Apply height constraint to Paper */}
            <Paper sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[20, 50, 100]}
                    rowCount={total}
                    paginationMode="server"
                    // Set initial state based on props
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: per_page, page: current_page - 1 },
                        },
                    }}
                    onPaginationModelChange={handlePaginationChange}
                    disableRowSelectionOnClick
                    // Removed autoHeight to respect Paper's height
                    sx={{ border: 0 }} // Remove default border when inside Paper
                />
            </Paper>
            {/* Fallback Pagination Links (optional) */}
            {/* ... */}
        </>
    );
}

Index.layout = page => <AdminLayout children={page} title="Navigation Items" />;
