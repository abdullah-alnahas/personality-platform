import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp, usePage } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { ColorModeContext } from "@/Hooks/useColorMode";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

const COLOR_MODE_KEY = "pp_color_mode";

const readSetting = (settings, key, fallback) => {
    const raw = settings?.[key]?.value;
    if (raw == null) return fallback;
    if (typeof raw === "object") {
        const v = raw.en ?? raw[Object.keys(raw)[0]];
        return v ? v : fallback;
    }
    return raw || fallback;
};

const resolveMode = (userChoice, defaultChoice) => {
    const choice = userChoice || defaultChoice || "auto";
    if (choice === "light" || choice === "dark") return choice;
    if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
    return "light";
};

const buildTheme = (pageProps, mode) => {
    const currentLocaleCode = pageProps?.current_locale || "en";
    const availableLocales = pageProps?.available_locales || [];
    const currentSelectedLocale = availableLocales.find(
        (l) => l.code === currentLocaleCode,
    );
    const direction = currentSelectedLocale?.is_rtl ? "rtl" : "ltr";

    if (typeof document !== "undefined") {
        document.documentElement.dir = direction;
        document.documentElement.lang = currentLocaleCode;
        document.documentElement.dataset.theme = mode;
    }

    const settings = pageProps?.settings || {};
    const isDark = mode === "dark";

    const palette = isDark
        ? {
              primary: readSetting(settings, "theme_primary_color_dark", "#8FAD83"),
              primaryDark: readSetting(settings, "theme_primary_dark_dark", "#6E8B62"),
              secondary: readSetting(settings, "theme_secondary_color_dark", "#C9F050"),
              background: readSetting(settings, "theme_background_color_dark", "#0F1411"),
              paper: readSetting(settings, "theme_paper_color_dark", "#181D19"),
              text: readSetting(settings, "theme_text_color_dark", "#E8E5DC"),
              textSecondary: readSetting(settings, "theme_text_secondary_color_dark", "#9AA197"),
          }
        : {
              primary: readSetting(settings, "theme_primary_color", "#4A6741"),
              primaryDark: readSetting(settings, "theme_primary_dark", "#2D4128"),
              secondary: readSetting(settings, "theme_secondary_color", "#B5D26B"),
              background: readSetting(settings, "theme_background_color", "#F7F4ED"),
              paper: readSetting(settings, "theme_paper_color", "#FFFFFF"),
              text: readSetting(settings, "theme_text_color", "#2A2A28"),
              textSecondary: readSetting(settings, "theme_text_secondary_color", "#6B6862"),
          };

    const themeHeadingFont = readSetting(
        settings,
        "theme_heading_font",
        direction === "rtl"
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
        readSetting(settings, "theme_border_radius", "10"),
        10,
    ) || 10;

    // Surface elevation tints for dark mode (parchment-like cool down for light)
    const dividerColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const subtleBg = isDark ? "#20272A" : "#EFEAE0";
    const cardShadow = isDark
        ? "0 2px 8px rgba(0,0,0,0.45)"
        : "0 2px 8px rgba(74,103,65,0.08)";

    return createTheme({
        direction,
        shape: { borderRadius },
        palette: {
            mode,
            primary: {
                main: palette.primary,
                dark: palette.primaryDark,
                light: isDark ? "#A8C29C" : "#7A9670",
                contrastText: isDark ? "#0F1411" : "#FFFFFF",
            },
            secondary: {
                main: palette.secondary,
                contrastText: isDark ? "#0F1411" : "#1E2A22",
            },
            background: { default: palette.background, paper: palette.paper },
            text: { primary: palette.text, secondary: palette.textSecondary },
            divider: dividerColor,
            error: { main: isDark ? "#E08585" : "#B45656" },
            warning: { main: isDark ? "#E5B970" : "#B8924C" },
            success: { main: palette.primary },
            islamic: {
                surface: subtleBg,
                primary: palette.primary,
                primaryDark: palette.primaryDark,
                accent: palette.secondary,
                paper: palette.paper,
            },
        },
        typography: {
            fontFamily: themeBodyFont,
            // 1.25 modular scale for visual rhythm (Aesthetic-Usability)
            h1: {
                fontFamily: themeHeadingFont,
                fontWeight: 700,
                fontSize: direction === "rtl" ? "3.0rem" : "2.6rem",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
            },
            h2: {
                fontFamily: themeHeadingFont,
                fontWeight: 700,
                fontSize: direction === "rtl" ? "2.4rem" : "2.05rem",
                lineHeight: 1.3,
            },
            h3: {
                fontFamily: themeHeadingFont,
                fontWeight: 600,
                fontSize: direction === "rtl" ? "1.95rem" : "1.65rem",
                lineHeight: 1.35,
            },
            h4: {
                fontFamily: themeHeadingFont,
                fontWeight: 600,
                fontSize: direction === "rtl" ? "1.6rem" : "1.35rem",
                lineHeight: 1.4,
            },
            h5: {
                fontFamily: themeHeadingFont,
                fontWeight: 500,
                fontSize: direction === "rtl" ? "1.35rem" : "1.15rem",
                lineHeight: 1.45,
            },
            h6: {
                fontFamily: themeHeadingFont,
                fontWeight: 500,
                fontSize: direction === "rtl" ? "1.1rem" : "1.0rem",
                lineHeight: 1.5,
            },
            body1: { lineHeight: 1.65 },
            body2: { lineHeight: 1.6 },
            button: { textTransform: "none", fontWeight: 600 },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        transition:
                            "background-color 240ms ease, color 240ms ease",
                    },
                    "::selection": {
                        background: palette.primary,
                        color: "#FFFFFF",
                    },
                    a: { color: palette.primary },
                    // Subtle scrollbar in dark mode
                    "*::-webkit-scrollbar": { width: 10, height: 10 },
                    "*::-webkit-scrollbar-track": {
                        background: "transparent",
                    },
                    "*::-webkit-scrollbar-thumb": {
                        background: dividerColor,
                        borderRadius: 8,
                    },
                    "*::-webkit-scrollbar-thumb:hover": {
                        background: isDark
                            ? "rgba(255,255,255,0.18)"
                            : "rgba(0,0,0,0.18)",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                    },
                    containedSecondary: {
                        color: isDark ? "#0F1411" : "#1E2A22",
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: palette.paper,
                        color: palette.text,
                        backgroundImage: "none",
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: borderRadius + 2,
                        boxShadow: cardShadow,
                        backgroundImage: "none",
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: "none" },
                },
            },
            MuiTextField: { defaultProps: { variant: "outlined" } },
            MuiSelect: { defaultProps: { variant: "outlined" } },
            MuiLink: { defaultProps: { underline: "hover" } },
        },
    });
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const DynamicThemeProvider = ({ children }) => {
            const { props: liveProps } = usePage();

            const defaultMode = readSetting(
                liveProps?.settings,
                "theme_mode_default",
                "auto",
            );

            const [userChoice, setUserChoice] = React.useState(() => {
                if (typeof window === "undefined") return "auto";
                return window.localStorage.getItem(COLOR_MODE_KEY) || "auto";
            });

            const [systemDark, setSystemDark] = React.useState(() => {
                if (typeof window === "undefined" || !window.matchMedia)
                    return false;
                return window.matchMedia("(prefers-color-scheme: dark)").matches;
            });

            React.useEffect(() => {
                if (typeof window === "undefined" || !window.matchMedia) return;
                const mq = window.matchMedia("(prefers-color-scheme: dark)");
                const onChange = (e) => setSystemDark(e.matches);
                mq.addEventListener?.("change", onChange);
                return () => mq.removeEventListener?.("change", onChange);
            }, []);

            const effectiveChoice =
                userChoice === "auto" ? defaultMode : userChoice;
            const mode =
                effectiveChoice === "auto"
                    ? systemDark
                        ? "dark"
                        : "light"
                    : effectiveChoice;

            const setMode = React.useCallback((next) => {
                setUserChoice(next);
                if (typeof window !== "undefined") {
                    if (next === "auto") {
                        window.localStorage.removeItem(COLOR_MODE_KEY);
                    } else {
                        window.localStorage.setItem(COLOR_MODE_KEY, next);
                    }
                }
            }, []);

            const toggleMode = React.useCallback(() => {
                setMode(mode === "dark" ? "light" : "dark");
            }, [mode, setMode]);

            const theme = React.useMemo(
                () => buildTheme(liveProps, mode),
                [
                    liveProps?.current_locale,
                    liveProps?.available_locales,
                    liveProps?.settings,
                    mode,
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

            const ctxValue = React.useMemo(
                () => ({ mode, userChoice, setMode, toggleMode }),
                [mode, userChoice, setMode, toggleMode],
            );

            return (
                <ColorModeContext.Provider value={ctxValue}>
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </ColorModeContext.Provider>
            );
        };

        const renderPage = ({ Component, key, props: pageProps }) => {
            const child = <Component key={key} {...pageProps} />;
            const withLayout =
                typeof Component.layout === "function"
                    ? Component.layout(child)
                    : Array.isArray(Component.layout)
                      ? Component.layout
                            .concat(child)
                            .reverse()
                            .reduce((children, Layout) =>
                                React.createElement(Layout, {
                                    children,
                                    ...pageProps,
                                }),
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
        color: "#4A6741",
    },
});
