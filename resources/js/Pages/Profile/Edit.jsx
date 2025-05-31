import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { Paper, Grid, Box, Typography } from "@mui/material";

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
                <Grid container spacing={3} justifyContent="center">
                    <Grid xs={12} md={10} lg={8}>
                        {" "}
                        {/* Grid v2 */}
                        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3 }}>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </Paper>
                    </Grid>
                    <Grid xs={12} md={10} lg={8}>
                        {" "}
                        {/* Grid v2 */}
                        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3 }}>
                            <UpdatePasswordForm />
                        </Paper>
                    </Grid>
                    <Grid xs={12} md={10} lg={8}>
                        {" "}
                        {/* Grid v2 */}
                        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                            <DeleteUserForm />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </AuthenticatedLayout>
    );
}
