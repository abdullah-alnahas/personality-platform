import React from "react";
import { Head, Link as InertiaLink, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    TextField,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Divider,
    Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

export default function Form({ role, permissions }) {
    const isEdit = Boolean(role?.id);
    const isSuperAdmin = role?.name === "Super Admin";

    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || "",
        permissions: role?.permissions || [],
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) put(route("admin.roles.update", role.id));
        else post(route("admin.roles.store"));
    };

    const togglePermission = (name, checked) => {
        if (checked)
            setData("permissions", [...new Set([...data.permissions, name])]);
        else
            setData(
                "permissions",
                data.permissions.filter((p) => p !== name),
            );
    };

    const toggleAll = (checked) =>
        setData("permissions", checked ? [...permissions] : []);

    return (
        <>
            <Head title={isEdit ? `Edit Role: ${role.name}` : "New Role"} />
            <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}
            >
                <Button
                    component={InertiaLink}
                    href={route("admin.roles.index")}
                    startIcon={<ArrowBackIcon />}
                >
                    Back
                </Button>
                <Typography variant="h4">
                    {isEdit ? "Edit Role" : "New Role"}
                </Typography>
                <Box />
            </Stack>

            <Paper sx={{ p: 3 }} component="form" onSubmit={submit} noValidate>
                <Stack spacing={2}>
                    <TextField
                        label="Role Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        fullWidth
                        disabled={isSuperAdmin}
                    />

                    <Divider>Permissions</Divider>

                    {isSuperAdmin && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Super Admin bypasses permission checks. Permissions
                            below are stored but not enforced for this role.
                        </Typography>
                    )}

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 1 }}
                    >
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => toggleAll(true)}
                        >
                            Select all
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => toggleAll(false)}
                        >
                            Clear
                        </Button>
                    </Stack>

                    <FormGroup>
                        <Grid container spacing={1}>
                            {permissions.map((p) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={data.permissions.includes(
                                                    p,
                                                )}
                                                onChange={(e) =>
                                                    togglePermission(
                                                        p,
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                        }
                                        label={p}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </FormGroup>

                    {errors.permissions && (
                        <Typography color="error" variant="caption">
                            {errors.permissions}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={processing}
                        >
                            {isEdit ? "Update Role" : "Create Role"}
                        </Button>
                        <Button
                            component={InertiaLink}
                            href={route("admin.roles.index")}
                            variant="text"
                        >
                            Cancel
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </>
    );
}

Form.layout = (page) => <AdminLayout children={page} title="Role" />;
