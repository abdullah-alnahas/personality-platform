// resources/js/Pages/Admin/ContentCategories/Index.jsx
import React from 'react';
import { Head, Link as InertiaLink, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout'; // Import your layout
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
    Pagination // For pagination controls
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

export default function Index({ categories /* auth, can */ }) { // Destructure props passed from controller

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.content-categories.destroy', id), {
                 preserveScroll: true // Keep scroll position after delete
            });
        }
    };

    // Extract pagination data
    const { data, current_page, per_page, total, links, from, to } = categories;

    return (
        <>
            <Head title="Content Categories" />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Content Categories</Typography>
                
                <Button
                    variant="contained"
                    component={InertiaLink}
                    href={route('admin.content-categories.create')}
                    startIcon={<AddIcon />}
                >
                    Create Category
                </Button>
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
                                        {/* Add permission check later: can?.update */}
                                        <IconButton
                                            aria-label="edit"
                                            size="small"
                                            component={InertiaLink}
                                            href={route('admin.content-categories.edit', category.id)}
                                        >
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                         {/* Add permission check later: can?.delete */}
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            onClick={() => handleDelete(category.id)}
                                            color="error"
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
                                    dangerouslySetInnerHTML={{ __html: link.label }} // Use label from backend
                                />
                             ))}
                         </Box>
                     </Box>
                 )}
            </Paper>
        </>
    );
}

// Assign Layout
Index.layout = page => <AdminLayout children={page} title="Content Categories" />;