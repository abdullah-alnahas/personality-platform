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
    TextField,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

export default function Index({ users, filters, can }) {
    const { data, current_page, per_page, total } = users;
    const [search, setSearch] = useState(filters?.search || "");
    const [deleteId, setDeleteId] = useState(null);

    const apply = (overrides = {}) => {
        router.get(
            route("admin.users.index"),
            { search, ...overrides, page: 1 },
            { preserveState: true, replace: true },
        );
    };

    const onPagination = (m) =>
        router.get(
            route("admin.users.index"),
            { search, page: m.page + 1, perPage: m.pageSize },
            { preserveState: true, replace: true },
        );

    const confirmDelete = () => {
        router.delete(route("admin.users.destroy", deleteId), {
            preserveScroll: true,
        });
        setDeleteId(null);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
        { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
        {
            field: "roles",
            headerName: "Roles",
            width: 240,
            renderCell: (p) => (
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {(p.value || []).map((r) => (
                        <Chip
                            key={r}
                            label={r}
                            size="small"
                            color={r === "Super Admin" ? "error" : "primary"}
                            variant={r === "Super Admin" ? "filled" : "outlined"}
                        />
                    ))}
                </Stack>
            ),
            sortable: false,
        },
        {
            field: "created_at",
            headerName: "Created",
            width: 180,
            valueFormatter: (v) => (v ? new Date(v).toLocaleDateString() : ""),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: ({ id }) => [
                <GridActionsCellItem
                    key={`edit-${id}`}
                    icon={
                        <Tooltip title="Edit">
                            <EditIcon />
                        </Tooltip>
                    }
                    label="Edit"
                    component={InertiaLink}
                    href={route("admin.users.edit", id)}
                    color="inherit"
                    disabled={!can?.edit}
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

    return (
        <>
            <Head title="Users" />
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
                <Typography variant="h4">Users</Typography>
                {can?.create && (
                    <Button
                        variant="contained"
                        component={InertiaLink}
                        href={route("admin.users.create")}
                        startIcon={<AddIcon />}
                    >
                        Add User
                    </Button>
                )}
            </Box>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        label="Search"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 240 }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") apply();
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={() => apply()}
                    >
                        Search
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{ height: "calc(100vh - 320px)", width: "100%" }}>
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
                    onPaginationModelChange={onPagination}
                    disableRowSelectionOnClick
                    localeText={{ noRowsLabel: "No users found." }}
                    sx={{ border: 0 }}
                />
            </Paper>

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Permanently remove this user? This cannot be undone.
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

Index.layout = (page) => <AdminLayout children={page} title="Users" />;
