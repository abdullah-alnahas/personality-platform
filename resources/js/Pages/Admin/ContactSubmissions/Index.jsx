import React, { useState } from "react";
import { Head, Link as InertiaLink, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Tooltip,
    Stack,
    TextField,
    MenuItem,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ArchiveIcon from "@mui/icons-material/Archive";

const STATUS_COLORS = {
    new: "warning",
    read: "info",
    archived: "default",
};

export default function Index({ submissions, filters, stats, can }) {
    const { data, current_page, per_page, total } = submissions;
    const [status, setStatus] = useState(filters?.status || "");
    const [deleteId, setDeleteId] = useState(null);

    const applyFilters = (overrides = {}) => {
        router.get(
            route("admin.contact-submissions.index"),
            { status, ...overrides, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handlePaginationChange = (model) => {
        router.get(
            route("admin.contact-submissions.index"),
            { status, page: model.page + 1, perPage: model.pageSize },
            { preserveState: true, replace: true },
        );
    };

    const archive = (id) => {
        router.put(
            route("admin.contact-submissions.update", id),
            { status: "archived" },
            { preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        router.delete(
            route("admin.contact-submissions.destroy", deleteId),
            { preserveScroll: true },
        );
        setDeleteId(null);
    };

    const truncate = (str, n = 80) =>
        !str ? "" : str.length > n ? str.slice(0, n) + "…" : str;

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (p) => (
                <Chip
                    label={p.value}
                    color={STATUS_COLORS[p.value] || "default"}
                    size="small"
                />
            ),
        },
        { field: "name", headerName: "Name", width: 180 },
        { field: "email", headerName: "Email", width: 220 },
        {
            field: "message",
            headerName: "Message",
            flex: 1,
            minWidth: 240,
            renderCell: (p) => (
                <Tooltip title={p.value || ""}>
                    <span>{truncate(p.value, 100)}</span>
                </Tooltip>
            ),
        },
        {
            field: "created_at",
            headerName: "Received",
            width: 180,
            valueFormatter: (v) => (v ? new Date(v).toLocaleString() : ""),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 140,
            getActions: ({ id, row }) => [
                <GridActionsCellItem
                    key={`view-${id}`}
                    icon={
                        <Tooltip title="View">
                            <VisibilityIcon />
                        </Tooltip>
                    }
                    label="View"
                    component={InertiaLink}
                    href={route("admin.contact-submissions.show", id)}
                    color="inherit"
                    disabled={!can?.view}
                />,
                <GridActionsCellItem
                    key={`arch-${id}`}
                    icon={
                        <Tooltip title="Archive">
                            <ArchiveIcon />
                        </Tooltip>
                    }
                    label="Archive"
                    onClick={() => archive(id)}
                    color="inherit"
                    disabled={!can?.update || row.status === "archived"}
                />,
                <GridActionsCellItem
                    key={`del-${id}`}
                    icon={
                        <Tooltip title="Delete">
                            <DeleteIcon />
                        </Tooltip>
                    }
                    label="Delete"
                    onClick={() => setDeleteId(id)}
                    color="error"
                    disabled={!can?.delete}
                />,
            ],
        },
    ];

    const statCards = [
        { label: "Total", value: stats?.total ?? 0, color: "primary.main" },
        { label: "New", value: stats?.new ?? 0, color: "warning.main" },
        { label: "Read", value: stats?.read ?? 0, color: "info.main" },
        { label: "Archived", value: stats?.archived ?? 0, color: "text.secondary" },
    ];

    return (
        <>
            <Head title="Contact Submissions" />
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Typography variant="h4">Contact Submissions</Typography>
                {can?.export && (
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        href={route("admin.contact-submissions.export")}
                    >
                        Export CSV
                    </Button>
                )}
            </Box>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 2 }}
            >
                {statCards.map((c) => (
                    <Card key={c.label} sx={{ flex: 1 }}>
                        <CardContent>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {c.label}
                            </Typography>
                            <Typography variant="h5" sx={{ color: c.color }}>
                                {c.value}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                >
                    <TextField
                        select
                        label="Status"
                        size="small"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            applyFilters({ status: e.target.value });
                        }}
                        sx={{ minWidth: 180 }}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="new">New</MenuItem>
                        <MenuItem value="read">Read</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                    </TextField>
                </Stack>
            </Paper>

            <Paper sx={{ height: "calc(100vh - 380px)", width: "100%" }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSizeOptions={[20, 50, 100]}
                    rowCount={total}
                    paginationMode="server"
                    paginationModel={{
                        pageSize: per_page,
                        page: current_page - 1,
                    }}
                    onPaginationModelChange={handlePaginationChange}
                    disableRowSelectionOnClick
                    localeText={{ noRowsLabel: "No submissions yet." }}
                    sx={{ border: 0 }}
                />
            </Paper>

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Delete Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Permanently remove this submission? This cannot be
                        undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button
                        onClick={confirmDelete}
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

Index.layout = (page) => (
    <AdminLayout children={page} title="Contact Submissions" />
);
