// Create file: resources/js/Pages/Admin/ContentItems/Index.jsx
import React from 'react';
import { Head, Link as InertiaLink, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Typography, Button, Paper, IconButton, Chip, Link, Tooltip, Avatar
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'; // Import DataGrid
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs'; // For formatting dates

// Helper function to display translated title (using default locale fallback)
const getTranslatedField = (fieldObject, locale = 'en', fallback = 'N/A') => {
    if (!fieldObject) return fallback;
    return fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};

export default function Index({ items, can }) { // Destructure props passed from controller
    const { data, links, current_page, per_page, total } = items; // Adjusted based on controller pagination structure

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            router.delete(route('admin.content-items.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Define columns for DataGrid
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'featured_image_thumb_url', // Use thumbnail if available
            headerName: 'Image',
            width: 80,
            renderCell: (params) => (
                params.value ? <Avatar src={params.value} variant="rounded" /> : <Avatar variant="rounded">-</Avatar>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: 'title_en', // Use a specific locale key for sorting/filtering if needed
            headerName: 'Title (EN)',
            flex: 1, // Make title flexible width
            minWidth: 200,
            renderCell: (params) => (
                 // Use InertiaLink to link to edit page
                <Link component={InertiaLink} href={route('admin.content-items.edit', params.row.id)} underline="hover">
                    {getTranslatedField(params.row.title)} {/* Display default/first translation */}
                </Link>
            )
        },
        { field: 'category_name', headerName: 'Category', width: 150 },
        { field: 'author_name', headerName: 'Author', width: 130 },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'published' ? 'success' : (params.value === 'draft' ? 'default' : 'warning')}
                    size="small"
                />
            )
        },
        {
            field: 'publish_date',
            headerName: 'Published',
            width: 120,
            renderCell: (params) => (
                params.value ? dayjs(params.value).format('YYYY-MM-DD') : '-'
            )
         },
        {
            field: 'updated_at',
            headerName: 'Last Updated',
            width: 160,
            renderCell: (params) => (
                dayjs(params.value).format('YYYY-MM-DD HH:mm')
            )
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => [ // Pass row id directly
                <GridActionsCellItem
                    key={`edit-${id}`}
                    icon={<Tooltip title="Edit Item"><EditIcon /></Tooltip>}
                    label="Edit"
                    component={InertiaLink}
                    href={route('admin.content-items.edit', id)}
                    color="inherit"
                    // disabled={!can?.edit_item} // Enable permission check later
                />,
                <GridActionsCellItem
                    key={`delete-${id}`}
                    icon={<Tooltip title="Delete Item"><DeleteIcon /></Tooltip>}
                    label="Delete"
                    onClick={() => handleDelete(id)}
                    color="error"
                     // disabled={!can?.delete_item} // Enable permission check later
                />,
            ],
        },
    ];

    // Prepare rows for DataGrid, ensuring title_en exists for sorting/filtering
    const rows = data.map(item => ({
        ...item,
        title_en: getTranslatedField(item.title, 'en', ''), // Extract EN title or fallback
    }));

    return (
        <>
            <Head title="Content Items" />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Content Items</Typography>
                {can?.create_item && ( // Use permission check later
                    <Button
                        variant="contained"
                        component={InertiaLink}
                        href={route('admin.content-items.create')}
                        startIcon={<AddIcon />}
                    >
                        Create Item
                    </Button>
                )}
            </Box>

            <Paper sx={{ height: 'calc(100vh - 220px)', width: '100%' }}> {/* Adjust height as needed */}
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[15, 30, 100]} // Options for rows per page
                    initialState={{
                       pagination: {
                         paginationModel: { pageSize: per_page, page: current_page - 1 }, // DataGrid is 0-indexed
                       },
                     }}
                    rowCount={total} // Total number of rows for server-side pagination
                    paginationMode="server" // Indicate server-side pagination
                    onPaginationModelChange={(model) => {
                        // Handle pagination change using Inertia
                        router.get(route('admin.content-items.index'), {
                            page: model.page + 1, // Convert back to 1-indexed for Laravel Paginator
                            perPage: model.pageSize, // Pass pageSize if you want to support changing it
                        }, { preserveState: true, replace: true });
                    }}
                    // Add sorting and filtering later if needed
                    // sortingMode="server"
                    // filterMode="server"
                    // onSortModelChange={handleSortChange}
                    // onFilterModelChange={handleFilterChange}
                    disableRowSelectionOnClick
                    autoHeight={false} // Disable autoHeight to use the Paper's height constraint
                    sx={{ border: 0 }} // Remove default border if inside Paper
                />
            </Paper>
             {/* Render Inertia pagination links as fallback or alternative */}
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
                                 dangerouslySetInnerHTML={{ __html: link.label }}
                             />
                         ))}
                     </Box>
                 </Box>
             )}
        </>
    );
}

// Assign Layout
Index.layout = page => <AdminLayout children={page} title="Content Items" />;