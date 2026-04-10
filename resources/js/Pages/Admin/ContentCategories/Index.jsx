import React, { useState } from 'react';
import { Head, Link as InertiaLink, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Helper function to display translated name (using default locale fallback)
// You might want to get the default locale from backend props later
const getTranslatedName = (nameObject, defaultLocale = 'en') => {
    if (!nameObject) return 'N/A';
    return nameObject[defaultLocale] || Object.values(nameObject)[0] || 'N/A';
};

export default function Index({ categories, can }) {
    const [deleteId, setDeleteId] = useState(null);
    const handleDelete = (id) => setDeleteId(id);
    const confirmDelete = () => {
        router.delete(route('admin.content-categories.destroy', deleteId), { preserveScroll: true });
        setDeleteId(null);
    };

    // Extract pagination data
    const { data, current_page, per_page, total, links, from, to } = categories;

    return (
        <>
            <Head title="Content Categories" />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Content Categories</Typography>
                
                {can?.create && (
                    <Button
                        variant="contained"
                        component={InertiaLink}
                        href={route('admin.content-categories.create')}
                        startIcon={<AddIcon />}
                    >
                        Create Category
                    </Button>
                )}
            </Box>

            <Paper>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name (EN)</TableCell> {/* Display default locale */}
                                <TableCell>Status</TableCell>
                                <TableCell>Order</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((category) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>{getTranslatedName(category.name)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={category.status}
                                            color={category.status === 'published' ? 'success' : 'default'}
                                            size="small"
                                         />
                                    </TableCell>
                                    <TableCell>{category.order ?? 'N/A'}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            aria-label="edit"
                                            size="small"
                                            component={InertiaLink}
                                            href={route('admin.content-categories.edit', category.id)}
                                            disabled={!can?.edit}
                                        >
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            onClick={() => handleDelete(category.id)}
                                            color="error"
                                            disabled={!can?.delete}
                                        >
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {data.length === 0 && (
                                 <TableRow>
                                     <TableCell colSpan={5} align="center">No categories found.</TableCell>
                                 </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </TableContainer>

                 {/* Basic Inertia Pagination */}
                 {links.length > 3 && ( // Only show pagination if needed
                     <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        {/* Use MUI Pagination component and adapt Inertia data or render Inertia links */}
                        {/* Rendering Inertia links directly is simpler for now: */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                             {links.map((link, index) => (
                                <Button
                                    key={index}
                                    component={InertiaLink}
                                    href={link.url} // Use Inertia Link for navigation
                                    disabled={!link.url} // Disable if URL is null
                                    size="small"
                                    variant={link.active ? 'contained' : 'outlined'} // Highlight active page
                                    children={link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')}
                                />
                             ))}
                         </Box>
                     </Box>
                 )}
            </Paper>

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this category? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

Index.layout = page => <AdminLayout children={page} title="Content Categories" />;