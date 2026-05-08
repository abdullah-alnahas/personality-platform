import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    CardContent,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";

const STATUS_COLORS = {
    pending: "warning",
    confirmed: "success",
    unsubscribed: "default",
};

export default function Index({ subscribers, filters, stats, can }) {
    const { data, current_page, per_page, total } = subscribers;
    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [deleteId, setDeleteId] = useState(null);

    const applyFilters = (overrides = {}) => {
        router.get(
            route("admin.subscribers.index"),
            { search, status, ...overrides, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const handlePaginationChange = (model) => {
        router.get(
            route("admin.subscribers.index"),
            { search, status, page: model.page + 1, perPage: model.pageSize },
            { preserveState: true, replace: true },
        );
    };

    const confirmDelete = () => {
        router.delete(route("admin.subscribers.destroy", deleteId), {
            preserveScroll: true,
        });
        setDeleteId(null);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "email", headerName: "Email", flex: 1, minWidth: 240 },
        {
            field: "status",
            headerName: "Status",
            width: 140,
            renderCell: (p) => (
                <Chip
                    label={p.value}
                    color={STATUS_COLORS[p.value] || "default"}
                    size="small"
                />
            ),
        },
        {
            field: "confirmed_at",
            headerName: "Confirmed",
            width: 180,
            valueFormatter: (v) => (v ? new Date(v).toLocaleString() : "—"),
        },
        {
            field: "created_at",
            headerName: "Subscribed",
            width: 180,
            valueFormatter: (v) => (v ? new Date(v).toLocaleString() : ""),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 90,
            getActions: ({ id }) => [
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
        { label: "Confirmed", value: stats?.confirmed ?? 0, color: "success.main" },
        { label: "Pending", value: stats?.pending ?? 0, color: "warning.main" },
        { label: "Unsubscribed", value: stats?.unsubscribed ?? 0, color: "text.secondary" },
    ];

    return (
        <>
            <Head title="Subscribers" />
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
                <Typography variant="h4">Subscribers</Typography>
                {can?.export && (
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        href={route("admin.subscribers.export")}
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
                        label="Search email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                        sx={{ minWidth: 240 }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") applyFilters();
                        }}
                    />
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
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="unsubscribed">Unsubscribed</MenuItem>
                    </TextField>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={() => applyFilters()}
                    >
                        Filter
                    </Button>
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
                    localeText={{ noRowsLabel: "No subscribers found." }}
                    sx={{ border: 0 }}
                />
            </Paper>

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Delete Subscriber</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Permanently remove this subscriber? This cannot be
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

Index.layout = (page) => <AdminLayout children={page} title="Subscribers" />;
