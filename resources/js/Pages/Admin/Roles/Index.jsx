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
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const BUILTIN = ["Super Admin", "Editor"];

export default function Index({ roles, can }) {
    const [deleteId, setDeleteId] = useState(null);

    const confirmDelete = () => {
        router.delete(route("admin.roles.destroy", deleteId), {
            preserveScroll: true,
        });
        setDeleteId(null);
    };

    return (
        <>
            <Head title="Roles" />
            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4">Roles</Typography>
                {can?.create && (
                    <Button
                        variant="contained"
                        component={InertiaLink}
                        href={route("admin.roles.create")}
                        startIcon={<AddIcon />}
                    >
                        Add Role
                    </Button>
                )}
            </Box>

            <Stack spacing={2}>
                {roles.map((role) => {
                    const isBuiltin = BUILTIN.includes(role.name);
                    return (
                        <Paper key={role.id} sx={{ p: 3 }}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                alignItems={{ sm: "center" }}
                                justifyContent="space-between"
                                sx={{ mb: 2 }}
                            >
                                <Box>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >
                                        <Typography variant="h6">
                                            {role.name}
                                        </Typography>
                                        {isBuiltin && (
                                            <Chip
                                                label="built-in"
                                                size="small"
                                                color="warning"
                                                variant="outlined"
                                            />
                                        )}
                                    </Stack>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {role.users_count} user
                                        {role.users_count === 1 ? "" : "s"} ·{" "}
                                        {role.permissions.length} permission
                                        {role.permissions.length === 1 ? "" : "s"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Tooltip title="Edit">
                                        <span>
                                            <IconButton
                                                component={InertiaLink}
                                                href={route(
                                                    "admin.roles.edit",
                                                    role.id,
                                                )}
                                                disabled={!can?.edit}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <span>
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    setDeleteId(role.id)
                                                }
                                                disabled={
                                                    !can?.delete || isBuiltin
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Box>
                            </Stack>
                            {role.name === "Super Admin" ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Has implicit access to all permissions via
                                    the auth gate.
                                </Typography>
                            ) : (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                >
                                    {role.permissions.length === 0 && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            No permissions assigned.
                                        </Typography>
                                    )}
                                    {role.permissions.map((p) => (
                                        <Chip
                                            key={p}
                                            label={p}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                            )}
                        </Paper>
                    );
                })}
            </Stack>

            <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
                <DialogTitle>Delete Role</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Permanently delete this role? Users assigned to it will
                        lose its permissions.
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

Index.layout = (page) => <AdminLayout children={page} title="Roles" />;
