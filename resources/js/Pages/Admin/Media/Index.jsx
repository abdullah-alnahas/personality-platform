import React, { useState } from "react";
import { Head, router } from "@inertiajs/react"; // Removed InertiaLink as not directly used for navigation here
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BrokenImageIcon from "@mui/icons-material/BrokenImage"; // For placeholder

const formatFileSize = (bytes) => {
    /* ... (same as before) ... */
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function Index({ mediaItems, can }) {
    const { data, links, current_page, last_page, total } = mediaItems;
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMediaId, setSelectedMediaId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedMediaId(id);
        setDialogOpen(true);
    };
    const handleConfirmDelete = () => {
        if (selectedMediaId) {
            router.delete(route("admin.media.destroy", selectedMediaId), {
                preserveScroll: true,
                onSuccess: () => setDialogOpen(false),
                onError: () => setDialogOpen(false),
            });
        }
    };
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedMediaId(null);
    };
    const handleMuiPageChange = (event, value) => {
        if (current_page !== value) {
            router.get(
                route("admin.media.index", { page: value }),
                {},
                { preserveState: true, preserveScroll: true },
            );
        }
    };

    return (
        <>
            <Head title="Media Library" />
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4">Media Library</Typography>
            </Box>
            <Paper sx={{ p: 2 }}>
                {data.length > 0 ? (
                    <Grid container spacing={2}>
                        {data.map((media) => (
                            <Grid xs={12} sm={6} md={4} lg={3} key={media.id}>
                                {" "}
                                {/* Grid v2 */}
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                    }}
                                >
                                    {media.mime_type?.startsWith("image/") &&
                                    media.thumb_url ? (
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                height: 160,
                                                objectFit: "cover",
                                            }}
                                            image={media.thumb_url}
                                            alt={media.name}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                height: 160,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor: "grey.200",
                                            }}
                                        >
                                            <BrokenImageIcon
                                                sx={{
                                                    fontSize: 60,
                                                    color: "grey.500",
                                                }}
                                            />
                                        </Box>
                                    )}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Tooltip title={media.file_name}>
                                            <Typography
                                                gutterBottom
                                                variant="subtitle1"
                                                component="div"
                                                noWrap
                                            >
                                                {media.name}
                                            </Typography>
                                        </Tooltip>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Type: {media.mime_type || "Unknown"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Size: {formatFileSize(media.size)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Collection:{" "}
                                            {media.collection_name || "N/A"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Uploaded: {media.created_at}
                                        </Typography>
                                    </CardContent>
                                    <CardActions
                                        sx={{ justifyContent: "flex-end" }}
                                    >
                                        {can?.delete_media && (
                                            <Tooltip title="Delete Media">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            media.id,
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography sx={{ textAlign: "center", py: 4 }}>
                        No media items found.
                    </Typography>
                )}
                {total > 0 && links.length > 3 && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4,
                        }}
                    >
                        <Pagination
                            count={last_page}
                            page={current_page}
                            onChange={handleMuiPageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                )}
            </Paper>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this media item? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
Index.layout = (page) => <AdminLayout children={page} title="Media Library" />;
