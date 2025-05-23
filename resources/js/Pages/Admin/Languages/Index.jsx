import React, { useState } from "react";
import { Head, Link as InertiaLink, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Box,
    Typography,
    Button,
    Paper,
    IconButton,
    Chip,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export default function Index({ languages, can }) {
    const { props } = usePage();
    const { data, links, current_page, per_page, total, from, to } = languages; // Pagination data from Laravel Paginator
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLanguageCode, setSelectedLanguageCode] = useState(null);

    const handleDeleteClick = (code) => {
        setSelectedLanguageCode(code);
        setDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedLanguageCode) {
            router.delete(
                route("admin.languages.destroy", selectedLanguageCode),
                {
                    preserveScroll: true,
                    onSuccess: () => setDialogOpen(false),
                    onError: () => setDialogOpen(false), // Also close on error or show error message
                },
            );
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedLanguageCode(null);
    };

    const columns = [
        { field: "code", headerName: "Code", width: 100 },
        { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
        {
            field: "native_name",
            headerName: "Native Name",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "is_active",
            headerName: "Active",
            width: 100,
            renderCell: (params) =>
                params.value ? (
                    <CheckCircleOutlineIcon color="success" />
                ) : (
                    <HighlightOffIcon color="action" />
                ),
        },
        {
            field: "is_rtl",
            headerName: "RTL",
            width: 80,
            renderCell: (params) =>
                params.value ? (
                    <CheckCircleOutlineIcon color="primary" />
                ) : (
                    <HighlightOffIcon color="action" />
                ),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 120,
            cellClassName: "actions",
            getActions: ({ row }) => [
                // Use row.code as ID is 'code' for languages
                ...(can?.edit_languages
                    ? [
                          <GridActionsCellItem
                              key={`edit-${row.code}`}
                              icon={
                                  <Tooltip title="Edit Language">
                                      <EditIcon />
                                  </Tooltip>
                              }
                              label="Edit"
                              component={InertiaLink}
                              href={route("admin.languages.edit", row.code)}
                              color="inherit"
                          />,
                      ]
                    : []),
                ...(can?.delete_languages
                    ? [
                          <GridActionsCellItem
                              key={`delete-${row.code}`}
                              icon={
                                  <Tooltip title="Delete Language">
                                      <DeleteIcon />
                                  </Tooltip>
                              }
                              label="Delete"
                              onClick={() => handleDeleteClick(row.code)}
                              color="error"
                              // Disable delete for default/fallback locales if needed (logic can be in controller or here)
                              // disabled={row.code === props.app_locale || row.code === props.fallback_locale}
                          />,
                      ]
                    : []),
            ],
        },
    ];

    const handlePaginationChange = (paginationModel) => {
        router.get(
            route("admin.languages.index"),
            {
                page: paginationModel.page + 1,
                perPage: paginationModel.pageSize,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Manage Languages" />
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4">Languages</Typography>
                {can?.create_languages && (
                    <Button
                        variant="contained"
                        component={InertiaLink}
                        href={route("admin.languages.create")}
                        startIcon={<AddIcon />}
                    >
                        Add Language
                    </Button>
                )}
            </Box>

            <Paper sx={{ height: "calc(100vh - 230px)", width: "100%" }}>
                {" "}
                {/* Adjust height as needed */}
                <DataGrid
                    rows={data}
                    columns={columns}
                    getRowId={(row) => row.code} // Specify 'code' as the unique ID field
                    pageSizeOptions={[15, 30, 50]}
                    rowCount={total}
                    paginationMode="server"
                    paginationModel={{
                        pageSize: per_page,
                        page: current_page - 1,
                    }}
                    onPaginationModelChange={handlePaginationChange}
                    disableRowSelectionOnClick
                    autoHeight={false} // Let Paper control height
                    sx={{ border: 0 }}
                />
            </Paper>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this language? This
                        action cannot be undone. Deleting a language might
                        affect existing translated content. Default or fallback
                        locales cannot be deleted.
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

Index.layout = (page) => (
    <AdminLayout children={page} title="Manage Languages" />
);
