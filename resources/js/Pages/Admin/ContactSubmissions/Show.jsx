import React, { useState } from "react";
import { Head, Link as InertiaLink, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Stack,
    Divider,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

const STATUS_COLORS = {
    new: "warning",
    read: "info",
    archived: "default",
};

export default function Show({ submission }) {
    const [status, setStatus] = useState(submission.status);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const updateStatus = (newStatus) => {
        setStatus(newStatus);
        router.put(
            route("admin.contact-submissions.update", submission.id),
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    const handleDelete = () => {
        router.delete(
            route("admin.contact-submissions.destroy", submission.id),
        );
    };

    return (
        <>
            <Head title={`Submission #${submission.id}`} />
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}
            >
                <Button
                    component={InertiaLink}
                    href={route("admin.contact-submissions.index")}
                    startIcon={<ArrowBackIcon />}
                    variant="text"
                >
                    Back
                </Button>
                <Typography variant="h4">
                    Submission #{submission.id}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        select
                        label="Status"
                        size="small"
                        value={status}
                        onChange={(e) => updateStatus(e.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value="new">New</MenuItem>
                        <MenuItem value="read">Read</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                    </TextField>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setConfirmDelete(true)}
                    >
                        Delete
                    </Button>
                </Stack>
            </Stack>

            <Paper sx={{ p: 3, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                        label={status}
                        color={STATUS_COLORS[status] || "default"}
                        size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                        Received{" "}
                        {submission.created_at
                            ? new Date(submission.created_at).toLocaleString()
                            : ""}
                    </Typography>
                </Stack>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Name
                    </Typography>
                    <Typography variant="body1">{submission.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Email
                    </Typography>
                    <Typography variant="body1">
                        <a href={`mailto:${submission.email}`}>
                            {submission.email}
                        </a>
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary">
                    Message
                </Typography>
                <Box
                    sx={{
                        whiteSpace: "pre-wrap",
                        bgcolor: "grey.50",
                        p: 2,
                        borderRadius: 1,
                        mt: 1,
                        fontFamily: "inherit",
                    }}
                >
                    {submission.message}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={4}
                    sx={{ color: "text.secondary" }}
                >
                    <Box>
                        <Typography variant="caption">IP</Typography>
                        <Typography variant="body2">
                            {submission.ip_address || "—"}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption">User agent</Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {submission.user_agent || "—"}
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Delete Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Permanently remove this submission? This cannot be
                        undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

Show.layout = (page) => (
    <AdminLayout children={page} title="Submission" />
);
