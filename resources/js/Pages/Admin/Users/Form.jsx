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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

export default function Form({ user, roles }) {
    const isEdit = Boolean(user?.id);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        password_confirmation: "",
        roles: user?.roles || [],
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("admin.users.update", user.id), {
                onSuccess: () =>
                    reset("password", "password_confirmation"),
            });
        } else {
            post(route("admin.users.store"));
        }
    };

    const toggleRole = (name, checked) => {
        if (checked) setData("roles", [...new Set([...data.roles, name])]);
        else setData("roles", data.roles.filter((r) => r !== name));
    };

    return (
        <>
            <Head title={isEdit ? `Edit User #${user.id}` : "New User"} />
            <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}
            >
                <Button
                    component={InertiaLink}
                    href={route("admin.users.index")}
                    startIcon={<ArrowBackIcon />}
                >
                    Back
                </Button>
                <Typography variant="h4">
                    {isEdit ? "Edit User" : "New User"}
                </Typography>
                <Box />
            </Stack>

            <Paper sx={{ p: 3 }} component="form" onSubmit={submit} noValidate>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        fullWidth
                    />
                    <Divider>
                        {isEdit ? "Change Password (optional)" : "Password"}
                    </Divider>
                    <TextField
                        label="Password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={!!errors.password}
                        helperText={
                            errors.password ||
                            (isEdit ? "Leave blank to keep existing." : "")
                        }
                        required={!isEdit}
                        fullWidth
                        autoComplete="new-password"
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required={!isEdit}
                        fullWidth
                        autoComplete="new-password"
                    />
                    <Divider>Roles</Divider>
                    <FormGroup>
                        {roles.map((r) => (
                            <FormControlLabel
                                key={r}
                                control={
                                    <Checkbox
                                        checked={data.roles.includes(r)}
                                        onChange={(e) =>
                                            toggleRole(r, e.target.checked)
                                        }
                                    />
                                }
                                label={r}
                            />
                        ))}
                    </FormGroup>
                    {errors.roles && (
                        <Typography color="error" variant="caption">
                            {errors.roles}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={processing}
                        >
                            {isEdit ? "Update User" : "Create User"}
                        </Button>
                        <Button
                            component={InertiaLink}
                            href={route("admin.users.index")}
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

Form.layout = (page) => <AdminLayout children={page} title="User" />;
