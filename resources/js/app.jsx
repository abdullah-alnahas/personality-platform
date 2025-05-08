// // resources/js/app.jsx
// import './bootstrap'; // Your Axios/CSRF setup
// import '../css/app.css'; // Your Tailwind/CSS file (if any)

// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { createInertiaApp } from '@inertiajs/react';
// import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
// import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// // --- Basic MUI Theme Definition ---
// // You can customize this much more later (palette, typography, etc.)
// const theme = createTheme({
//     // Directionality based on the predominantly Arabic content [cite: 1, 2, 3]
//     direction: 'rtl',
  
//     // Color Palette inferred from the document's visuals
//     palette: {
//       primary: {
//         // Using the teal/green accent color seen in highlights [cite: 1]
//         main: '#008080', // Teal - Adjust this hex code if a more precise color is known
//         contrastText: '#ffffff', // White text contrasts well with teal
//       },
//       secondary: {
//         // Using the subtle beige/off-white background color [cite: 2]
//         main: '#f5f5dc', // Beige - Adjust as needed
//         contrastText: '#333333', // Darker text for contrast on beige
//       },
//       background: {
//         default: '#f5f5dc', // Main background color [cite: 2]
//         paper: '#ffffff', // White for elements like Cards, Paper
//       },
//       text: {
//         primary: '#333333', // Dark grey for primary text [cite: 1, 2, 3]
//         secondary: '#555555', // Lighter grey for secondary text
//       },
//       // Adding an accent color seen on page 1 [cite: 1]
//       error: { // Often used for accents if not specifically for errors
//         main: '#D87093', // PaleVioletRed - Approximation of the pinkish accent
//       },
//     },
  
//     // Typography - Prioritizing Arabic fonts [cite: 1, 2, 3]
//     typography: {
//       fontFamily: [
//         'Cairo', // A good modern Arabic font
//         'Tajawal', // Another good Arabic font option
//         'Noto Sans Arabic', // Google's Noto font for Arabic
//         'Roboto', // Fallback Latin font
//         '"Helvetica Neue"',
//         'Arial',
//         'sans-serif',
//       ].join(','),
//       h1: { fontWeight: 700 },
//       h2: { fontWeight: 600 },
//       h3: { fontWeight: 600 },
//       h4: { fontWeight: 500 },
//       h5: { fontWeight: 500 },
//       h6: { fontWeight: 500 },
//       // You might want to adjust font sizes, weights, etc. further
//     },
  
//     // Component Overrides (Examples)
//     components: {
//       MuiButton: {
//         styleOverrides: {
//           root: {
//             borderRadius: 8, // Slightly rounded corners
//             textTransform: 'none', // Keep button text case as is
//           },
//           containedPrimary: {
//             // Style for primary buttons based on the palette
//             backgroundColor: '#008080', // Teal
//             '&:hover': {
//               backgroundColor: '#006666', // Darker teal on hover
//             },
//           },
//         },
//       },
//       MuiAppBar: {
//         styleOverrides: {
//           root: {
//             backgroundColor: '#ffffff', // White AppBar background
//             color: '#333333', // Dark text on AppBar
//           },
//         },
//       },
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             borderRadius: 12, // More rounded cards
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow
//           },
//         },
//       },
//       // Add more component overrides as needed based on the specific UI elements
//       // used in your application, referencing the visual style of the PDF.
//     },
//   });
  
// export default theme;

// const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// createInertiaApp({
//     title: (title) => `${title} - ${appName}`,
//     resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
//     setup({ el, App, props }) {
//         const root = createRoot(el);
//         root.render(
//             // Wrap with LocalizationProvider
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <ThemeProvider theme={theme}>
//                     <CssBaseline />
//                     <App {...props} />
//                 </ThemeProvider>
//             </LocalizationProvider>
//         );
//     },
//     progress: {
//         color: '#4B5563',
//     },
// });
// Edit file: resources/js/app.jsx
import './bootstrap'; // Your Axios/CSRF setup
import '../css/app.css'; // Your Tailwind/CSS file

// --- Import Slick Carousel CSS ---
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// --- End Slick Carousel CSS ---

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// --- Basic MUI Theme Definition ---
const theme = createTheme({
    direction: 'rtl',
    palette: {
        primary: { main: '#008080', contrastText: '#ffffff', },
        secondary: { main: '#f5f5dc', contrastText: '#333333', },
        background: { default: '#f5f5dc', paper: '#ffffff', },
        text: { primary: '#333333', secondary: '#555555', },
        error: { main: '#D87093', },
    },
    typography: {
        fontFamily: ['Cairo', 'Tajawal', 'Noto Sans Arabic', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
        h1: { fontWeight: 700 }, h2: { fontWeight: 600 }, h3: { fontWeight: 600 },
        h4: { fontWeight: 500 }, h5: { fontWeight: 500 }, h6: { fontWeight: 500 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 8, textTransform: 'none', },
                containedPrimary: { backgroundColor: '#008080', '&:hover': { backgroundColor: '#006666', }, },
            },
        },
        MuiAppBar: { styleOverrides: { root: { backgroundColor: '#ffffff', color: '#333333', }, }, },
        MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', }, }, },
    },
});

// export default theme; // This line was likely a mistake from previous edits, appName is not a theme.

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={theme}> {/* Use the defined theme */}
                    <CssBaseline />
                    <App {...props} />
                </ThemeProvider>
            </LocalizationProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
