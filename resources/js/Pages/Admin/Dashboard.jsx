import React from 'react';
import { Head, Link as InertiaLink } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
    Chip,
    Stack,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CategoryIcon from '@mui/icons-material/Category';
import WebIcon from '@mui/icons-material/Web';
import ShareIcon from '@mui/icons-material/Share';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useLocale } from '@/Hooks/useLocale';

function StatCard({ icon, label, value, color, href }) {
    return (
        <Paper
            component={href ? InertiaLink : 'div'}
            href={href}
            elevation={2}
            sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'box-shadow 0.2s',
                '&:hover': href ? { boxShadow: 6 } : {},
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: `${color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color,
                    flexShrink: 0,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="h4" fontWeight={700} lineHeight={1}>
                    {value ?? 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {label}
                </Typography>
            </Box>
        </Paper>
    );
}

export default function Dashboard({ stats = {}, recentItems = [], auth }) {
    const { getTranslatedField, currentLocale } = useLocale();

    const cards = [
        { icon: <WebIcon />, label: 'Pages', value: stats.pages, color: '#1976d2', href: route('admin.pages.index') },
        { icon: <ArticleIcon />, label: 'Content Items', value: stats.content_items, color: '#388e3c', href: route('admin.content-items.index') },
        { icon: <CategoryIcon />, label: 'Categories', value: stats.categories, color: '#f57c00', href: route('admin.content-categories.index') },
        { icon: <MenuBookIcon />, label: 'Books', value: stats.books, color: '#7b1fa2', href: route('admin.books.index') },
        { icon: <SchoolIcon />, label: 'Scholars', value: stats.scholars, color: '#c62828', href: route('admin.scholars.index') },
        { icon: <FormatQuoteIcon />, label: 'Quotes', value: stats.quotes, color: '#00796b', href: route('admin.quotes.index') },
        { icon: <ShareIcon />, label: 'Social Accounts', value: stats.social_accounts, color: '#1565c0', href: route('admin.social-accounts.index') },
        { icon: <NavigationIcon />, label: 'Nav Items', value: stats.nav_items, color: '#558b2f', href: route('admin.navigation-items.index') },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <Typography variant="h5" gutterBottom fontWeight={600}>
                Welcome back, {auth?.user?.name ?? 'Admin'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Here's an overview of your content.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={3} key={card.label}>
                        <StatCard {...card} />
                    </Grid>
                ))}
            </Grid>

            <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                    Recent Content Items
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {recentItems.length === 0 ? (
                    <Typography color="text.secondary">No content items yet.</Typography>
                ) : (
                    <Stack spacing={1.5}>
                        {recentItems.map((item) => {
                            const title = getTranslatedField(item.title, currentLocale, 'Untitled');
                            const categoryName = item.category_name
                                ? getTranslatedField(item.category_name, currentLocale, '')
                                : null;
                            return (
                                <Box
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        py: 0.5,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Chip
                                        size="small"
                                        label={item.status}
                                        color={item.status === 'published' ? 'success' : 'default'}
                                        sx={{ minWidth: 80 }}
                                    />
                                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                        {title}
                                    </Typography>
                                    {categoryName && (
                                        <Typography variant="caption" color="text.secondary">
                                            {categoryName}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="text.disabled">
                                        {item.created_at}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Stack>
                )}
            </Paper>
        </>
    );
}

Dashboard.layout = (page) => <AdminLayout children={page} title="Dashboard" />;
