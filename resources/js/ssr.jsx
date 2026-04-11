import ReactDOMServer from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route } from '../../vendor/tightenco/ziggy';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
        setup: ({ App, props }) => {
            global.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });

            const currentLocale = page.props.current_locale || 'en';
            const availableLocales = page.props.available_locales || [];
            const currentLang = availableLocales.find((l) => l.code === currentLocale);
            const direction = currentLang?.is_rtl ? 'rtl' : 'ltr';

            const theme = createTheme({
                direction,
                palette: {
                    primary: { main: '#2B3D2F' },
                    secondary: { main: '#C9A94E' },
                    background: { default: '#F5F0E8', paper: '#FFFFFF' },
                },
                typography: {
                    fontFamily: direction === 'rtl'
                        ? "'Tajawal', 'Cairo', 'Roboto', sans-serif"
                        : "'Cairo', 'Roboto', sans-serif",
                },
            });

            return (
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <App {...props} />
                </ThemeProvider>
            );
        },
    })
);
