import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp, usePage } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// No need to import useLocale here, it will be used by components

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const readSetting = (settings, key, fallback) => {
            const raw = settings?.[key]?.value;
            if (raw == null) return fallback;
            if (typeof raw === "object") {
                const v = raw.en ?? raw[Object.keys(raw)[0]];
                return v ? v : fallback;
            }
            return raw || fallback;
        };

        const createAppTheme = (pageProps) => {
            // Access locale info from pageProps, which should be updated by Inertia
            const currentLocaleCode = pageProps?.current_locale || "en";
            const availableLocales = pageProps?.available_locales || [];
            const currentSelectedLocale = availableLocales.find(
                (lang) => lang.code === currentLocaleCode,
            );
            const direction = currentSelectedLocale?.is_rtl ? "rtl" : "ltr";

            document.documentElement.dir = direction;
            document.documentElement.lang = currentLocaleCode;

            const settings = pageProps?.settings || {};

            // Islamic design palette — defaults; overridden by site_settings if set
            const islamicColors = {
                darkGreen: readSetting(settings, "theme_primary_color", "#2B3D2F"),
                deepGreen: readSetting(settings, "theme_primary_dark", "#1E2A22"),
                olive: '#6B7B4C',
                oliveLight: '#8B9A6B',
                cream: readSetting(settings, "theme_background_color", "#F5F0E8"),
                creamLight: '#FAF7F2',
                gold: readSetting(settings, "theme_secondary_color", "#C9A94E"),
                goldLight: '#D4B96A',
                warmWhite: '#FEFCF8',
            };

            const textColor = readSetting(settings, "theme_text_color", "#2C2C2C");
            const themeHeadingFont = readSetting(
                settings,
                "theme_heading_font",
                direction === 'rtl'
                    ? "'Amiri', 'Traditional Arabic', 'Tajawal', serif"
                    : "'Amiri', 'Georgia', 'Times New Roman', serif",
            );
            const themeBodyFont = readSetting(
                settings,
                "theme_body_font",
                [
                    ...(direction === "rtl" ? ["Tajawal", "Noto Sans Arabic"] : []),
                    "Cairo",
                    "Roboto",
                    '"Helvetica Neue"',
                    "Arial",
                    "sans-serif",
                ].join(","),
            );
            const borderRadius = parseInt(
                readSetting(settings, "theme_border_radius", "8"),
                10,
            ) || 8;

            const headingFontFamily = themeHeadingFont;
            const bodyFontFamily = themeBodyFont;

            return createTheme({
                direction: direction,
                shape: { borderRadius },
                palette: {
                    primary: { main: islamicColors.darkGreen, light: islamicColors.olive, dark: islamicColors.deepGreen, contrastText: '#ffffff' },
                    secondary: { main: islamicColors.gold, light: islamicColors.goldLight, contrastText: '#1a1a1a' },
                    background: { default: islamicColors.cream, paper: '#FFFFFF' },
                    text: { primary: textColor, secondary: '#5A5A5A' },
                    error: { main: '#D32F2F' },
                    islamic: islamicColors,
                },
                typography: {
                    fontFamily: bodyFontFamily,
                    h1: { fontFamily: headingFontFamily, fontWeight: 700, fontSize: direction === 'rtl' ? '3.2rem' : '2.8rem', lineHeight: 1.3 },
                    h2: { fontFamily: headingFontFamily, fontWeight: 700, fontSize: direction === 'rtl' ? '2.5rem' : '2.2rem', lineHeight: 1.3 },
                    h3: { fontFamily: headingFontFamily, fontWeight: 600, fontSize: direction === 'rtl' ? '2.0rem' : '1.8rem', lineHeight: 1.4 },
                    h4: { fontFamily: headingFontFamily, fontWeight: 600, fontSize: direction === 'rtl' ? '1.7rem' : '1.5rem', lineHeight: 1.4 },
                    h5: { fontFamily: headingFontFamily, fontWeight: 500, fontSize: direction === 'rtl' ? '1.4rem' : '1.25rem', lineHeight: 1.5 },
                    h6: { fontFamily: headingFontFamily, fontWeight: 500, fontSize: direction === 'rtl' ? '1.15rem' : '1.0rem', lineHeight: 1.5 },
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                textTransform: 'none',
                                fontWeight: 500,
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: '#FFFFFF',
                                color: '#2C2C2C',
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 12,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            },
                        },
                    },
                    MuiTextField: { defaultProps: { variant: 'outlined' } },
                    MuiSelect: { defaultProps: { variant: 'outlined' } },
                },
            });
        };

        // DynamicThemeProvider uses live Inertia props so theme direction
        // updates when the user switches language without a full page reload.
        // Must be rendered INSIDE <App> so usePage() finds the Inertia context.
        const DynamicThemeProvider = ({ children }) => {
            const { props: liveProps } = usePage();
            const theme = React.useMemo(
                () => createAppTheme(liveProps),
                [
                    liveProps?.current_locale,
                    liveProps?.available_locales,
                    liveProps?.settings,
                ],
            );

            React.useEffect(() => {
                const raw = liveProps?.settings?.theme_decorations_enabled?.value;
                const enabled = raw == null
                    ? true
                    : typeof raw === "object"
                        ? String(raw.en ?? "1") !== "0"
                        : String(raw) !== "0";
                document.body.classList.toggle("no-decorations", !enabled);
            }, [liveProps?.settings]);

            return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
        };

        const renderPage = ({ Component, key, props: pageProps }) => {
            const child = <Component key={key} {...pageProps} />;
            const withLayout = typeof Component.layout === 'function'
                ? Component.layout(child)
                : Array.isArray(Component.layout)
                    ? Component.layout.concat(child).reverse().reduce(
                        (children, Layout) => React.createElement(Layout, { children, ...pageProps }),
                    )
                    : child;
            return (
                <DynamicThemeProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CssBaseline />
                        {withLayout}
                    </LocalizationProvider>
                </DynamicThemeProvider>
            );
        };

        root.render(<App {...props}>{renderPage}</App>);
    },
    progress: {
        color: "#2B3D2F",
    },
});
