import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { Paper, Grid, Box, Typography } from "@mui/material"; // Import MUI components

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: "semibold", color: "text.primary" }}
                >
                    Profile
                </Typography>
            }
        >
            <Head title="Profile" />

            <Box sx={{ py: { xs: 2, sm: 3, md: 6 } }}>
                {" "}
                {/* Replaces py-12 */}
                <Grid container spacing={3} justifyContent="center">
                    {" "}
                    {/* Replaces max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 */}
                    <Grid item xs={12} md={10} lg={8}>
                        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3 }}>
                            {" "}
                            {/* Replaces p-4 sm:p-8 bg-white shadow sm:rounded-lg */}
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                // className="max-w-xl" // Will be handled by MUI Grid or internal Box in the component
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={10} lg={8}>
                        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3 }}>
                            {" "}
                            {/* Replaces p-4 sm:p-8 bg-white shadow sm:rounded-lg */}
                            <UpdatePasswordForm
                            // className="max-w-xl" // Will be handled by MUI Grid or internal Box in the component
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={10} lg={8}>
                        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                            {" "}
                            {/* Replaces p-4 sm:p-8 bg-white shadow sm:rounded-lg */}
                            <DeleteUserForm
                            // className="max-w-xl" // Will be handled by MUI Grid or internal Box in the component
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </AuthenticatedLayout>
    );
}
