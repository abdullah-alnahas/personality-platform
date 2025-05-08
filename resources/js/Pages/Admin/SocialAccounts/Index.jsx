// Create file: resources/js/Pages/Admin/SocialAccounts/Index.jsx
import React from 'react';
import { Head, Link as InertiaLink, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box, Typography, Button, Paper, IconButton, Chip, Link as MuiLink, Tooltip
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LaunchIcon from '@mui/icons-material/Launch';
// Import specific social icons (or use a mapping component)
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link'; // Default icon

const SocialPlatformIcon = ({ platform }) => {
    switch (platform?.toLowerCase()) {
        case 'facebook': return <FacebookIcon fontSize="inherit" />;
        case 'x': return <TwitterIcon fontSize="inherit" />; // Use Twitter for X
        case 'twitter': return <TwitterIcon fontSize="inherit" />;
        case 'youtube': return <YouTubeIcon fontSize="inherit" />;
        case 'instagram': return <InstagramIcon fontSize="inherit" />;
        case 'telegram': return <TelegramIcon fontSize="inherit" />;
        case 'linkedin': return <LinkedInIcon fontSize="inherit" />;
        // Add TikTok or others if needed
        default: return <LinkIcon fontSize="inherit" />;
    }
};

// Helper function to display translated name
const getTranslatedField = (fieldObject, locale = 'en', fallback = 'N/A') => {
    if (!fieldObject) return fallback;
    return fieldObject[locale] || Object.values(fieldObject)[0] || fallback;
};


export default function Index({ accounts, can }) {
    const { data, links, current_page, per_page, total } = accounts;

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this social account?')) {
            router.delete(route('admin.social-accounts.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'platform',
            headerName: 'Platform',
            width: 120,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SocialPlatformIcon platform={params.value} />
                    {params.value.charAt(0).toUpperCase() + params.value.slice(1)} {/* Capitalize */}
                </Box>
            )
        },
        {
            field: 'account_name_en', // Base for potential sorting
            headerName: 'Account Name (EN)',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => getTranslatedField(params.row.account_name) || <i>(Default)</i>
        },
        {
            field: 'url',
            headerName: 'URL',
            flex: 1,
            minWidth: 250,
            renderCell: (params) => (
                <MuiLink href={params.value} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ display: 'flex', alignItems: 'center' }}>
                    {params.value}
                    <LaunchIcon fontSize="inherit" sx={{ ml: 0.5, fontSize: '0.8rem' }} />
                </MuiLink>
            )
        },
        { field: 'display_order', headerName: 'Order', width: 80 },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === 'active' ? 'success' : 'default'}
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
                    icon={<Tooltip title="Edit Account"><EditIcon /></Tooltip>}
                    label="Edit"
                    component={InertiaLink}
                    href={route('admin.social-accounts.edit', id)}
                    color="inherit"
                    disabled={!can?.edit}
                />,
                <GridActionsCellItem
                    key={`delete-${id}`}
                    icon={<Tooltip title="Delete Account"><DeleteIcon /></Tooltip>}
                    label="Delete"
                    onClick={() => handleDelete(id)}
                    color="error"
                    disabled={!can?.delete}
                />,
            ],
        },
    ];

    // Prepare rows
    const rows = data.map(account => ({
        ...account,
        account_name_en: getTranslatedField(account.account_name, 'en', ''), // Add for sorting
    }));

    // Handle pagination changes for DataGrid
    const handlePaginationChange = (paginationModel) => {
        router.get(route('admin.social-accounts.index'), {
            page: paginationModel.page + 1,
            perPage: paginationModel.pageSize,
        }, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Social Accounts" />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Social Accounts</Typography>
                {can?.create && (
                    <Button
                        variant="contained"
                        component={InertiaLink}
                        href={route('admin.social-accounts.create')}
                        startIcon={<AddIcon />}
                    >
                        Add Account
                    </Button>
                )}
            </Box>

            <Paper sx={{ height: 'calc(100vh - 220px)', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[20, 50, 100]}
                    rowCount={total}
                    paginationMode="server"
                    paginationModel={{ pageSize: per_page, page: current_page - 1 }}
                    onPaginationModelChange={handlePaginationChange}
                    disableRowSelectionOnClick
                    autoHeight={false}
                    sx={{ border: 0 }}
                />
            </Paper>
            {/* Optional Fallback Pagination */}
            {/* ... */}
        </>
    );
}

Index.layout = page => <AdminLayout children={page} title="Social Accounts" />;
