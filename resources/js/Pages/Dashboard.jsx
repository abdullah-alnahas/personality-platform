import React from "react"; // Added React
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Already uses MUI
import { Head } from "@inertiajs/react";
import { Box, Paper, Typography } from "@mui/material"; // Import MUI components

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: "semibold", color: "text.primary" }}
                >
                    Dashboard
                </Typography>
            }
        >
            <Head title="Dashboard" />

            {/* The AuthenticatedLayout already provides a Container. We can add Paper for a card-like effect. */}
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
                {" "}
                {/* Replaces bg-white overflow-hidden shadow-sm sm:rounded-lg */}
                <Typography variant="body1" color="text.primary">
                    {" "}
                    {/* Replaces p-6 text-gray-900 */}
                    You're logged in!
                </Typography>
                {/* You can add more MUI structured content here if this dashboard were to be expanded */}
            </Paper>
        </AuthenticatedLayout>
    );
}
