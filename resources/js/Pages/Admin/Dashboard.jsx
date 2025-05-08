// resources/js/Pages/Admin/Dashboard.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout'; // Import the layout
import Typography from '@mui/material/Typography'; // Import Typography for styling
import Paper from '@mui/material/Paper'; // Import Paper for background
import Box from '@mui/material/Box'; // Import Box for structure

export default function Dashboard(props) {
    // props.auth contains authenticated user info if shared via HandleInertiaRequests
    // const { user } = props.auth;

    return (
        <>
            {/* Head component is still useful for setting page-specific titles */}
            <Head title="Admin Dashboard" />

            {/* Use MUI components for content presentation */}
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            <Paper sx={{ p: 2 }}> {/* Add padding and background */}
                 <Typography variant="body1">
                     Welcome back, {props.auth?.user?.name ?? 'Admin'}! (Placeholder)
                 </Typography>
                 {/* Add more dashboard widgets or content here later */}
            </Paper>
        </>
    );
}

// --- Assign the layout to the Dashboard component ---
// This is the recommended way for persistent layouts in Inertia
Dashboard.layout = page => <AdminLayout children={page} title="Dashboard" />;