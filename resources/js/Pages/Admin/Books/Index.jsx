import React, { useState } from "react";
import { Head, Link as InertiaLink, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Box,
    Typography,
    Button,
    Paper,
    Tooltip,
    Chip,
    Avatar,
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
import MenuBookIcon from "@mui/icons-material/MenuBook";

const getT = (field, locale = "ar") => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] || field.ar || field.en || Object.values(field)[0] || "";
};

export default function Index({ books, can }) {
    const { props } = usePage();
    const locale = props.locale || "ar";
    const { data, current_page, per_page, total } = books;
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = (id) => setDeleteId(id);
    const confirmDelete = () => {
        router.delete(route("admin.books.destroy", deleteId), { preserveScroll: true });
        setDeleteId(null);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 60 },
        {
            field: "cover",
            headerName: "Cover",
            width: 70,
            renderCell: (params) =>
                params.row.cover_image_url ? (
                    <Avatar
                        variant="rounded"
                        src={params.row.cover_image_url}
                        sx={{ width: 40, height: 55 }}
                    />
                ) : (
                    <Avatar variant="rounded" sx={{ width: 40, height: 55 }}>
                        <MenuBookIcon fontSize="small" />
                    </Avatar>
                ),
        },
        {
            field: "title",
            headerName: "Title",
            flex: 2,
            minWidth: 200,
            renderCell: (params) => getT(params.row.title, locale),
        },
        {
            field: "category",
            headerName: "Category",
            width: 140,
            renderCell: (params) => params.value || "—",
        },
        {
            field: "display_order",
            headerName: "Order",
            width: 80,
        },
        {
            field: "is_featured",
            headerName: "Featured",
            width: 90,
            renderCell: (params) =>
                params.value ? <Chip label="Yes" size="small" color="warning" /> : null,
        },
        {
            field: "status",
            headerName: "Status",
            width: 110,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={params.value === "published" ? "success" : "default"}
                />
            ),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: ({ id }) => [
                ...(can?.edit
                    ? [
                          <GridActionsCellItem
                              key={`edit-${id}`}
                              icon={<Tooltip title="Edit"><EditIcon /></Tooltip>}
                              label="Edit"
                              component={InertiaLink}
                              href={route("admin.books.edit", id)}
                              color="inherit"
                          />,
                      ]
                    : []),
                ...(can?.delete
                    ? [
                          <GridActionsCellItem
                              key={`delete-${id}`}
                              icon={<Tooltip title="Delete"><DeleteIcon /></Tooltip>}
                              label="Delete"
                              onClick={() => handleDelete(id)}
                              color="error"
                          />,
                      ]
                    : []),
            ],
        },
    ];

    return (
        <>
            <Head title="Books / Publications" />
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4">Books / Publications</Typography>
                {can?.create && (
                    <Button
                        variant="contained"
                        component={InertiaLink}
                        href={route("admin.books.create")}
                        startIcon={<AddIcon />}
                    >
                        Add Book
                    </Button>
                )}
            </Box>
            <Paper sx={{ height: "calc(100vh - 220px)", width: "100%" }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    pageSizeOptions={[20, 50]}
                    rowCount={total}
                    paginationMode="server"
                    paginationModel={{ pageSize: per_page, page: current_page - 1 }}
                    onPaginationModelChange={(m) =>
                        router.get(
                            route("admin.books.index"),
                            { page: m.page + 1, perPage: m.pageSize },
                            { preserveState: true, replace: true }
                        )
                    }
                    disableRowSelectionOnClick
                    rowHeight={65}
                    localeText={{ noRowsLabel: "No books found." }}
                    sx={{ border: 0 }}
                />
            </Paper>

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Delete Book</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this book? This action cannot be undone.</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} title="Books" />;
