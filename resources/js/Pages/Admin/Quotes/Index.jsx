import React from "react";
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
    Link as MuiLink,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

// Helper function to display translated field (using default locale fallback)
const getTranslatedField = (fieldObject, locale = "en", fallback = "N/A") => {
    const { props } = usePage();
    const currentLocale = props.locale || locale; // Use shared locale if available
    if (!fieldObject) return fallback;
    if (typeof fieldObject !== "object" || fieldObject === null)
        return String(fieldObject) || fallback;
    return (
        fieldObject[currentLocale] ||
        fieldObject[locale] ||
        Object.values(fieldObject)[0] ||
        fallback
    );
};

export default function Index({ quotes, can }) {
    const { data, links, current_page, per_page, total } = quotes; // For DataGrid server-side pagination

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this quote?")) {
            router.delete(route("admin.quotes.destroy", id), {
                preserveScroll: true,
            });
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "text_preview",
            headerName: "Text (Preview)",
            flex: 2,
            minWidth: 250,
            renderCell: (params) => (
                <Tooltip title={getTranslatedField(params.row.text)}>
                    <Typography variant="body2" noWrap>
                        {getTranslatedField(params.row.text).substring(0, 100)}
                        {getTranslatedField(params.row.text).length > 100
                            ? "..."
                            : ""}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: "source_preview",
            headerName: "Source",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => getTranslatedField(params.row.source),
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={
                        params.value.charAt(0).toUpperCase() +
                        params.value.slice(1)
                    }
                    color={
                        params.value === "published"
                            ? "success"
                            : params.value === "draft"
                              ? "default"
                              : "warning"
                    }
                    size="small"
                />
            ),
        },
        {
            field: "is_featured",
            headerName: "Featured",
            width: 100,
            renderCell: (params) =>
                params.value ? (
                    <CheckCircleOutlineIcon color="success" />
                ) : (
                    <HighlightOffIcon color="action" />
                ),
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => [
                ...(can?.edit
                    ? [
                          <GridActionsCellItem
                              key={`edit-${id}`}
                              icon={
                                  <Tooltip title="Edit Quote">
                                      <EditIcon />
                                  </Tooltip>
                              }
                              label="Edit"
                              component={InertiaLink}
                              href={route("admin.quotes.edit", id)}
                              color="inherit"
                          />,
                      ]
                    : []),
                ...(can?.delete
                    ? [
                          <GridActionsCellItem
                              key={`delete-${id}`}
                              icon={
                                  <Tooltip title="Delete Quote">
                                      <DeleteIcon />
                                  </Tooltip>
                              }
                              label="Delete"
                              onClick={() => handleDelete(id)}
                              color="error"
                          />,
                      ]
                    : []),
            ],
        },
    ];

    // Prepare rows for DataGrid
    const rows = data.map((quote) => ({
        ...quote,
        // Add specific locale versions if needed for direct filtering/sorting by DataGrid on one language
        // text_en: getTranslatedField(quote.text, 'en', ''),
    }));

    const handlePaginationChange = (paginationModel) => {
        router.get(
            route("admin.quotes.index"),
            {
                page: paginationModel.page + 1, // DataGrid is 0-indexed
                perPage: paginationModel.pageSize,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Quotes Management" />
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4">Quotes</Typography>
                {can?.create && (
                    <Button
                        variant="contained"
                        component={InertiaLink}
                        href={route("admin.quotes.create")}
                        startIcon={<AddIcon />}
                    >
                        Create Quote
                    </Button>
                )}
            </Box>

            <Paper sx={{ height: "calc(100vh - 220px)", width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[15, 30, 50]}
                    rowCount={total}
                    paginationMode="server"
                    paginationModel={{
                        pageSize: per_page,
                        page: current_page - 1,
                    }}
                    onPaginationModelChange={handlePaginationChange}
                    disableRowSelectionOnClick
                    autoHeight={false}
                    sx={{ border: 0 }}
                />
            </Paper>
        </>
    );
}

Index.layout = (page) => (
    <AdminLayout children={page} title="Quotes Management" />
);
