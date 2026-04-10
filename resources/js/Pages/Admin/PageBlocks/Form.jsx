import React, { useState, useEffect } from 'react';
import { Head, Link as InertiaLink, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import RichTextEditor from '@/Components/RichTextEditor';
import {
    Box, Typography, TextField, Button, Paper, Grid,
    FormControl, InputLabel, Select, MenuItem, FormHelperText,
    Divider, Switch, FormControlLabel, IconButton, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

/** Inline color picker: text field + native color input swatch */
const ColorPickerField = ({ label, value, onChange, helperText }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
            fullWidth
            size="small"
            label={label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            helperText={helperText}
        />
        <Box
            component="input"
            type="color"
            value={value || '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            sx={{
                width: 40,
                height: 40,
                p: 0,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                cursor: 'pointer',
                flexShrink: 0,
                '&::-webkit-color-swatch-wrapper': { p: 0 },
                '&::-webkit-color-swatch': { border: 'none', borderRadius: 1 },
            }}
        />
    </Box>
);

/** Block style presets */
const BLOCK_PRESETS = {
    hero_banner: [
        { label: 'Islamic Dark', config: { background_color: '#2B3D2F', text_color: '#ffffff', show_decorations: true, decoration_color: '#C9A94E', layout: 'split' } },
        { label: 'Deep Green Centered', config: { background_color: '#1E2A22', text_color: '#ffffff', show_decorations: true, decoration_color: '#D4B96A', layout: 'centered' } },
        { label: 'Cream Light', config: { background_color: '#F5F0E8', text_color: '#2B3D2F', show_decorations: false, layout: 'centered' } },
    ],
    pillar_cards: [
        { label: 'Dark Cards on Green', config: { background_color: '#2B3D2F', text_color: '#ffffff', card_variant: 'dark', columns: 3 } },
        { label: 'Light Cards on Cream', config: { background_color: '#F5F0E8', text_color: '#2C2C2C', card_variant: 'light', columns: 3 } },
    ],
    quran_verse: [
        { label: 'Deep Blue Overlay', config: { background_color: '#1a237e', text_color: '#ffffff', layout: 'overlay', accent_color: '#C9A94E' } },
        { label: 'Dark Green Card', config: { background_color: '#1E2A22', text_color: '#ffffff', layout: 'card', accent_color: '#C9A94E' } },
    ],
    logo_grid: [
        { label: 'Dark Islamic', config: { background_color: '#1E2A22', text_color: '#ffffff', columns: 4, grayscale: false } },
        { label: 'Cream Background', config: { background_color: '#F5F0E8', text_color: '#2C2C2C', columns: 4, grayscale: true } },
    ],
    newsletter_cta: [
        { label: 'Islamic Green', config: { background_color: '#2B3D2F', text_color: '#ffffff' } },
        { label: 'Gold Accent', config: { background_color: '#C9A94E', text_color: '#1E2A22' } },
    ],
    featured_quote: [
        { label: 'Dark Elegance', config: { background_color: '#1a1a2e', text_color: '#ffffff' } },
        { label: 'Islamic Green', config: { background_color: '#1E2A22', text_color: '#ffffff' } },
    ],
    stats_counter: [
        { label: 'Islamic Green', config: { background_color: '#2B3D2F', text_color: '#ffffff', accent_color: '#C9A94E', columns: 3 } },
        { label: 'Deep Dark', config: { background_color: '#1E2A22', text_color: '#ffffff', accent_color: '#C9A94E', columns: 3 } },
        { label: 'Cream Light', config: { background_color: '#F5F0E8', text_color: '#2B3D2F', accent_color: '#2B3D2F', columns: 3 } },
    ],
    books_grid: [
        { label: 'Dark Islamic', config: { background_color: '#1E2A22', text_color: '#ffffff', columns: 4 } },
        { label: 'Deep Navy', config: { background_color: '#1a1a2e', text_color: '#ffffff', columns: 4 } },
    ],
    scholar_cards: [
        { label: 'Cream Background', config: { background_color: '#F5F0E8', text_color: '#2B3D2F', accent_color: '#2B3D2F' } },
        { label: 'Dark Green', config: { background_color: '#2B3D2F', text_color: '#ffffff', accent_color: '#C9A94E' } },
    ],
};

/** Logo item default (simpler than full card) */
const makeLogoDefault = (activeLanguages) => ({
    heading: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {}),
    image_url: '',
    link: '',
});

const getTranslatedFieldLocal = (fieldObject, pageProps, localeKeyToUse = 'en', fallback = '') => {
    const currentLocale = pageProps.locale || localeKeyToUse;
    if (!fieldObject) return fallback;
    if (typeof fieldObject !== 'object' || fieldObject === null) return String(fieldObject) || fallback;
    return fieldObject[currentLocale] || fieldObject[localeKeyToUse] || Object.values(fieldObject)[0] || fallback;
};

const makeTranslatableDefault = (activeLanguages, existingValue) => {
    return activeLanguages.reduce((acc, lang) => ({
        ...acc,
        [lang]: existingValue?.[lang] ?? '',
    }), {});
};

const makeTranslatableListDefault = (activeLanguages) => ({
    text: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {}),
    icon: '',
});

const makeCardDefault = (activeLanguages) => ({
    heading: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {}),
    quote: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {}),
    image_url: '',
    items: [],
    link: '',
    link_text: activeLanguages.reduce((acc, lang) => ({ ...acc, [lang]: '' }), {}),
});

export default function Form({
    page,
    block,
    blockTypes,
    blockTypeLabels,
    categories,
    quotes,
    activeLanguages: controllerActiveLanguages,
    nextOrder,
}) {
    const isEditing = !!block;
    const { props: pageProps } = usePage();
    const activeLanguages =
        Array.isArray(controllerActiveLanguages) && controllerActiveLanguages.every(lang => typeof lang === 'string')
            ? controllerActiveLanguages
            : ['en', 'ar', 'tr'];

    const buildInitialContent = (blockType, existingContent) => {
        if (existingContent && Object.keys(existingContent).length > 0) {
            return existingContent;
        }
        if (!blockType || !blockTypes?.[blockType]?.fields) return {};
        const fields = blockTypes[blockType].fields;
        const content = {};
        Object.entries(fields).forEach(([key, fieldDef]) => {
            switch (fieldDef.type) {
                case 'translatable_text':
                case 'translatable_richtext':
                    content[key] = makeTranslatableDefault(activeLanguages, null);
                    break;
                case 'text':
                    content[key] = '';
                    break;
                case 'number':
                    content[key] = fieldDef.default ?? 0;
                    break;
                case 'boolean':
                    content[key] = fieldDef.default ?? false;
                    break;
                case 'select':
                    content[key] = fieldDef.default ?? '';
                    break;
                case 'relation':
                    content[key] = '';
                    break;
                case 'translatable_list':
                    content[key] = [];
                    break;
                case 'card_list':
                    content[key] = [];
                    break;
                default:
                    content[key] = '';
            }
        });
        return content;
    };

    const initialBlockType = block?.block_type ?? '';
    const initialContent = buildInitialContent(initialBlockType, block?.content);

    const { data, setData, post, processing, errors } = useForm({
        block_type: initialBlockType,
        content: initialContent,
        config: {
            background_color: block?.config?.background_color ?? '',
            text_color: block?.config?.text_color ?? '',
            padding_y: block?.config?.padding_y ?? 'md',
            full_width: block?.config?.full_width ?? false,
            css_class: block?.config?.css_class ?? '',
        },
        display_order: block?.display_order ?? nextOrder ?? 0,
        status: block?.status ?? 'draft',
        _method: isEditing ? 'PUT' : 'POST',
    });

    const [selectedBlockType, setSelectedBlockType] = useState(initialBlockType);

    const handleBlockTypeChange = (newType) => {
        setSelectedBlockType(newType);
        const newContent = buildInitialContent(newType, null);
        setData(prev => ({
            ...prev,
            block_type: newType,
            content: newContent,
        }));
    };

    const handleContentChange = (fieldKey, value) => {
        setData('content', { ...data.content, [fieldKey]: value });
    };

    const handleTranslatableContentChange = (fieldKey, langCode, valueOrEvent) => {
        let newValue;
        if (valueOrEvent && typeof valueOrEvent === 'object' && valueOrEvent.target) {
            newValue = valueOrEvent.target.value;
        } else {
            newValue = valueOrEvent;
        }
        setData('content', {
            ...data.content,
            [fieldKey]: { ...(data.content[fieldKey] || {}), [langCode]: newValue },
        });
    };

    const handleConfigChange = (configKey, value) => {
        setData('config', { ...data.config, [configKey]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const routeName = isEditing ? 'admin.pages.blocks.update' : 'admin.pages.blocks.store';
        const routeParams = isEditing ? [page.id, block.id] : page.id;
        post(route(routeName, routeParams), {
            preserveScroll: true,
        });
    };

    // --- Translatable List helpers ---
    const addTranslatableListItem = (fieldKey) => {
        const currentList = data.content[fieldKey] || [];
        handleContentChange(fieldKey, [...currentList, makeTranslatableListDefault(activeLanguages)]);
    };

    const removeTranslatableListItem = (fieldKey, index) => {
        const currentList = [...(data.content[fieldKey] || [])];
        currentList.splice(index, 1);
        handleContentChange(fieldKey, currentList);
    };

    const updateTranslatableListItem = (fieldKey, index, subField, langOrValue, maybeValue) => {
        const currentList = [...(data.content[fieldKey] || [])];
        const item = { ...currentList[index] };
        if (subField === 'text' && maybeValue !== undefined) {
            item.text = { ...(item.text || {}), [langOrValue]: maybeValue };
        } else if (subField === 'icon') {
            item.icon = langOrValue;
        }
        currentList[index] = item;
        handleContentChange(fieldKey, currentList);
    };

    // --- Logo List helpers (simplified card for logo_grid) ---
    const addLogo = (fieldKey) => {
        const currentList = data.content[fieldKey] || [];
        handleContentChange(fieldKey, [...currentList, makeLogoDefault(activeLanguages)]);
    };

    const removeLogo = (fieldKey, index) => {
        const currentList = [...(data.content[fieldKey] || [])];
        currentList.splice(index, 1);
        handleContentChange(fieldKey, currentList);
    };

    const updateLogo = (fieldKey, index, field, langOrValue, maybeValue) => {
        const currentList = [...(data.content[fieldKey] || [])];
        const logo = { ...currentList[index] };
        if (field === 'heading' && maybeValue !== undefined) {
            logo.heading = { ...(logo.heading || {}), [langOrValue]: maybeValue };
        } else if (['image_url', 'link'].includes(field)) {
            logo[field] = langOrValue;
        }
        currentList[index] = logo;
        handleContentChange(fieldKey, currentList);
    };

    // --- Card List helpers ---
    const addCard = (fieldKey) => {
        const currentList = data.content[fieldKey] || [];
        handleContentChange(fieldKey, [...currentList, makeCardDefault(activeLanguages)]);
    };

    const removeCard = (fieldKey, index) => {
        const currentList = [...(data.content[fieldKey] || [])];
        currentList.splice(index, 1);
        handleContentChange(fieldKey, currentList);
    };

    const updateCard = (fieldKey, cardIndex, cardField, langOrValue, maybeValue) => {
        const currentList = [...(data.content[fieldKey] || [])];
        const card = { ...currentList[cardIndex] };
        if (['heading', 'quote', 'link_text'].includes(cardField) && maybeValue !== undefined) {
            card[cardField] = { ...(card[cardField] || {}), [langOrValue]: maybeValue };
        } else if (['image_url', 'link'].includes(cardField)) {
            card[cardField] = langOrValue;
        }
        currentList[cardIndex] = card;
        handleContentChange(fieldKey, currentList);
    };

    const addCardItem = (fieldKey, cardIndex) => {
        const currentList = [...(data.content[fieldKey] || [])];
        const card = { ...currentList[cardIndex] };
        card.items = [...(card.items || []), makeTranslatableListDefault(activeLanguages)];
        currentList[cardIndex] = card;
        handleContentChange(fieldKey, currentList);
    };

    const removeCardItem = (fieldKey, cardIndex, itemIndex) => {
        const currentList = [...(data.content[fieldKey] || [])];
        const card = { ...currentList[cardIndex] };
        const items = [...(card.items || [])];
        items.splice(itemIndex, 1);
        card.items = items;
        currentList[cardIndex] = card;
        handleContentChange(fieldKey, currentList);
    };

    const updateCardItem = (fieldKey, cardIndex, itemIndex, subField, langOrValue, maybeValue) => {
        const currentList = [...(data.content[fieldKey] || [])];
        const card = { ...currentList[cardIndex] };
        const items = [...(card.items || [])];
        const item = { ...items[itemIndex] };
        if (subField === 'text' && maybeValue !== undefined) {
            item.text = { ...(item.text || {}), [langOrValue]: maybeValue };
        } else if (subField === 'icon') {
            item.icon = langOrValue;
        }
        items[itemIndex] = item;
        card.items = items;
        currentList[cardIndex] = card;
        handleContentChange(fieldKey, currentList);
    };

    // --- Field rendering ---
    const currentFields = blockTypes?.[selectedBlockType]?.fields ?? {};

    const renderField = (fieldKey, fieldDef) => {
        const label = fieldDef.label || fieldKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const isRequired = fieldDef.required ?? false;

        switch (fieldDef.type) {
            case 'translatable_text':
                return (
                    <Grid item xs={12} key={fieldKey}>
                        <Typography variant="subtitle2" gutterBottom>{label}</Typography>
                        <Grid container spacing={2}>
                            {activeLanguages.map((lang) => (
                                <Grid item xs={12} md={activeLanguages.length > 1 ? 4 : 12} key={`${fieldKey}-${lang}`}>
                                    <TextField
                                        required={isRequired && lang === (pageProps.locale || 'en')}
                                        fullWidth
                                        id={`content-${fieldKey}-${lang}`}
                                        label={`${label} (${lang.toUpperCase()})`}
                                        value={data.content[fieldKey]?.[lang] ?? ''}
                                        onChange={(e) => handleTranslatableContentChange(fieldKey, lang, e)}
                                        error={!!errors[`content.${fieldKey}.${lang}`]}
                                        helperText={errors[`content.${fieldKey}.${lang}`]}
                                        multiline={fieldDef.multiline ?? false}
                                        rows={fieldDef.rows ?? 1}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                );

            case 'translatable_richtext':
                return (
                    <Grid item xs={12} key={fieldKey}>
                        <Typography variant="subtitle2" gutterBottom>{label}</Typography>
                        <Grid container spacing={2}>
                            {activeLanguages.map((lang) => (
                                <Grid item xs={12} md={activeLanguages.length > 1 ? 4 : 12} key={`${fieldKey}-${lang}`}>
                                    <Typography variant="caption" display="block" gutterBottom>
                                        {`${label} (${lang.toUpperCase()})`}
                                    </Typography>
                                    <RichTextEditor
                                        value={data.content[fieldKey]?.[lang] ?? ''}
                                        onChange={(value) => handleTranslatableContentChange(fieldKey, lang, value)}
                                        placeholder={`Enter ${label.toLowerCase()} for ${lang.toUpperCase()}...`}
                                        direction={lang === 'ar' ? 'rtl' : 'ltr'}
                                        error={!!errors[`content.${fieldKey}.${lang}`]}
                                        helperText={errors[`content.${fieldKey}.${lang}`]}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                );

            case 'text':
                return (
                    <Grid item xs={12} sm={6} md={4} key={fieldKey}>
                        <TextField
                            required={isRequired}
                            fullWidth
                            id={`content-${fieldKey}`}
                            label={label}
                            value={data.content[fieldKey] ?? ''}
                            onChange={(e) => handleContentChange(fieldKey, e.target.value)}
                            error={!!errors[`content.${fieldKey}`]}
                            helperText={errors[`content.${fieldKey}`]}
                        />
                    </Grid>
                );

            case 'number':
                return (
                    <Grid item xs={12} sm={6} md={4} key={fieldKey}>
                        <TextField
                            required={isRequired}
                            fullWidth
                            type="number"
                            id={`content-${fieldKey}`}
                            label={label}
                            value={data.content[fieldKey] ?? 0}
                            onChange={(e) => handleContentChange(fieldKey, Number(e.target.value))}
                            error={!!errors[`content.${fieldKey}`]}
                            helperText={errors[`content.${fieldKey}`]}
                        />
                    </Grid>
                );

            case 'boolean':
                return (
                    <Grid item xs={12} sm={6} md={4} key={fieldKey}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!!data.content[fieldKey]}
                                    onChange={(e) => handleContentChange(fieldKey, e.target.checked)}
                                    name={`content-${fieldKey}`}
                                />
                            }
                            label={label}
                        />
                        {errors[`content.${fieldKey}`] && (
                            <FormHelperText error>{errors[`content.${fieldKey}`]}</FormHelperText>
                        )}
                    </Grid>
                );

            case 'select':
                return (
                    <Grid item xs={12} sm={6} md={4} key={fieldKey}>
                        <FormControl fullWidth error={!!errors[`content.${fieldKey}`]}>
                            <InputLabel id={`content-${fieldKey}-label`}>{label}</InputLabel>
                            <Select
                                labelId={`content-${fieldKey}-label`}
                                id={`content-${fieldKey}`}
                                value={data.content[fieldKey] ?? ''}
                                label={label}
                                required={isRequired}
                                onChange={(e) => handleContentChange(fieldKey, e.target.value)}
                            >
                                <MenuItem value=""><em>Select...</em></MenuItem>
                                {(fieldDef.options || []).map((opt) => (
                                    <MenuItem key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
                                        {typeof opt === 'object' ? opt.label : opt}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors[`content.${fieldKey}`] && <FormHelperText>{errors[`content.${fieldKey}`]}</FormHelperText>}
                        </FormControl>
                    </Grid>
                );

            case 'relation': {
                let relationOptions = [];
                if (fieldDef.model === 'ContentCategory' && categories) {
                    relationOptions = categories.map(cat => ({
                        value: cat.id,
                        label: getTranslatedFieldLocal(cat.name, pageProps),
                    }));
                } else if (fieldDef.model === 'Quote' && quotes) {
                    relationOptions = quotes.map(q => ({
                        value: q.id,
                        label: getTranslatedFieldLocal(q.text || q.content, pageProps, 'en', `Quote #${q.id}`),
                    }));
                }
                return (
                    <Grid item xs={12} sm={6} md={4} key={fieldKey}>
                        <FormControl fullWidth error={!!errors[`content.${fieldKey}`]}>
                            <InputLabel id={`content-${fieldKey}-label`}>{label}</InputLabel>
                            <Select
                                labelId={`content-${fieldKey}-label`}
                                id={`content-${fieldKey}`}
                                value={data.content[fieldKey] ?? ''}
                                label={label}
                                required={isRequired}
                                onChange={(e) => handleContentChange(fieldKey, e.target.value)}
                            >
                                <MenuItem value=""><em>Select...</em></MenuItem>
                                {relationOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                            {errors[`content.${fieldKey}`] && <FormHelperText>{errors[`content.${fieldKey}`]}</FormHelperText>}
                        </FormControl>
                    </Grid>
                );
            }

            case 'translatable_list': {
                const listItems = data.content[fieldKey] || [];
                return (
                    <Grid item xs={12} key={fieldKey}>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2">{label}</Typography>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => addTranslatableListItem(fieldKey)}
                                >
                                    Add Item
                                </Button>
                            </Box>
                            {listItems.map((item, index) => (
                                <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="caption">Item {index + 1}</Typography>
                                        <IconButton size="small" color="error" onClick={() => removeTranslatableListItem(fieldKey, index)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {activeLanguages.map((lang) => (
                                            <Grid item xs={12} md={activeLanguages.length > 1 ? 4 : 12} key={`${fieldKey}-${index}-text-${lang}`}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label={`Text (${lang.toUpperCase()})`}
                                                    value={item.text?.[lang] ?? ''}
                                                    onChange={(e) => updateTranslatableListItem(fieldKey, index, 'text', lang, e.target.value)}
                                                />
                                            </Grid>
                                        ))}
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Icon"
                                                value={item.icon ?? ''}
                                                onChange={(e) => updateTranslatableListItem(fieldKey, index, 'icon', e.target.value)}
                                                helperText="Icon name or class"
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                            {listItems.length === 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                                    No items added. Click "Add Item" to begin.
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                );
            }

            case 'card_list': {
                const cards = data.content[fieldKey] || [];

                // Simplified logo editor for logo_grid block
                if (selectedBlockType === 'logo_grid' && fieldKey === 'logos') {
                    return (
                        <Grid item xs={12} key={fieldKey}>
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle2">{label}</Typography>
                                    <Button size="small" startIcon={<AddIcon />} onClick={() => addLogo(fieldKey)}>
                                        Add Logo
                                    </Button>
                                </Box>
                                {cards.map((logo, logoIndex) => (
                                    <Paper key={logoIndex} variant="outlined" sx={{ p: 2, mb: 1.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Typography variant="subtitle2">Logo {logoIndex + 1}</Typography>
                                                {logo.image_url && (
                                                    <Box
                                                        component="img"
                                                        src={logo.image_url}
                                                        alt=""
                                                        sx={{ height: 30, maxWidth: 80, objectFit: 'contain', borderRadius: 0.5, bgcolor: 'grey.100', p: 0.5 }}
                                                    />
                                                )}
                                            </Box>
                                            <IconButton size="small" color="error" onClick={() => removeLogo(fieldKey, logoIndex)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        <Grid container spacing={2}>
                                            {activeLanguages.map((lang) => (
                                                <Grid item xs={12} md={activeLanguages.length > 1 ? 4 : 12} key={`logo-${logoIndex}-name-${lang}`}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        label={`Name (${lang.toUpperCase()})`}
                                                        value={logo.heading?.[lang] ?? ''}
                                                        onChange={(e) => updateLogo(fieldKey, logoIndex, 'heading', lang, e.target.value)}
                                                    />
                                                </Grid>
                                            ))}
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Logo Image URL"
                                                    value={logo.image_url ?? ''}
                                                    onChange={(e) => updateLogo(fieldKey, logoIndex, 'image_url', e.target.value)}
                                                    helperText="URL to logo image (PNG/SVG recommended)"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Link URL"
                                                    value={logo.link ?? ''}
                                                    onChange={(e) => updateLogo(fieldKey, logoIndex, 'link', e.target.value)}
                                                    helperText="Optional external link"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                                {cards.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                                        No logos added. Click "Add Logo" to begin.
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    );
                }

                // Standard card list editor
                return (
                    <Grid item xs={12} key={fieldKey}>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2">{label}</Typography>
                                <Button size="small" startIcon={<AddIcon />} onClick={() => addCard(fieldKey)}>
                                    Add Card
                                </Button>
                            </Box>
                            {cards.map((card, cardIndex) => (
                                <Paper key={cardIndex} variant="outlined" sx={{ p: 2, mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="subtitle2">Card {cardIndex + 1}</Typography>
                                        <IconButton size="small" color="error" onClick={() => removeCard(fieldKey, cardIndex)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="caption" display="block" gutterBottom>Heading</Typography>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        {activeLanguages.map((lang) => (
                                            <Grid item xs={12} md={activeLanguages.length > 1 ? 4 : 12} key={`card-${cardIndex}-heading-${lang}`}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label={`Heading (${lang.toUpperCase()})`}
                                                    value={card.heading?.[lang] ?? ''}
                                                    onChange={(e) => updateCard(fieldKey, cardIndex, 'heading', lang, e.target.value)}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Typography variant="caption" display="block" gutterBottom>Quote</Typography>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        {activeLanguages.map((lang) => (
                                            <Grid item xs={12} md={activeLanguages.length > 1 ? 4 : 12} key={`card-${cardIndex}-quote-${lang}`}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label={`Quote (${lang.toUpperCase()})`}
                                                    value={card.quote?.[lang] ?? ''}
                                                    onChange={(e) => updateCard(fieldKey, cardIndex, 'quote', lang, e.target.value)}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Image URL"
                                                value={card.image_url ?? ''}
                                                onChange={(e) => updateCard(fieldKey, cardIndex, 'image_url', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Link"
                                                value={card.link ?? ''}
                                                onChange={(e) => updateCard(fieldKey, cardIndex, 'link', e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Typography variant="caption" display="block" gutterBottom>Link Text</Typography>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        {activeLanguages.map((lang) => (
                                            <Grid item xs={12} md={activeLanguages.length > 1 ? 4 : 12} key={`card-${cardIndex}-link_text-${lang}`}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label={`Link Text (${lang.toUpperCase()})`}
                                                    value={card.link_text?.[lang] ?? ''}
                                                    onChange={(e) => updateCard(fieldKey, cardIndex, 'link_text', lang, e.target.value)}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Box sx={{ mt: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="caption">Items</Typography>
                                            <Button size="small" startIcon={<AddIcon />} onClick={() => addCardItem(fieldKey, cardIndex)}>
                                                Add Item
                                            </Button>
                                        </Box>
                                        {(card.items || []).map((item, itemIndex) => (
                                            <Paper key={itemIndex} variant="outlined" sx={{ p: 1.5, mb: 1, bgcolor: 'grey.50' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="caption">Item {itemIndex + 1}</Typography>
                                                    <IconButton size="small" color="error" onClick={() => removeCardItem(fieldKey, cardIndex, itemIndex)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                <Grid container spacing={1}>
                                                    {activeLanguages.map((lang) => (
                                                        <Grid item xs={12} md={activeLanguages.length > 1 ? 4 : 12} key={`card-${cardIndex}-item-${itemIndex}-${lang}`}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label={`Text (${lang.toUpperCase()})`}
                                                                value={item.text?.[lang] ?? ''}
                                                                onChange={(e) => updateCardItem(fieldKey, cardIndex, itemIndex, 'text', lang, e.target.value)}
                                                            />
                                                        </Grid>
                                                    ))}
                                                    <Grid item xs={12} sm={6} md={4}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Icon"
                                                            value={item.icon ?? ''}
                                                            onChange={(e) => updateCardItem(fieldKey, cardIndex, itemIndex, 'icon', e.target.value)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        ))}
                                        {(!card.items || card.items.length === 0) && (
                                            <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
                                                No items. Click "Add Item" to begin.
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>
                            ))}
                            {cards.length === 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                                    No cards added. Click "Add Card" to begin.
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                );
            }

            case 'stat_list': {
                const stats = data.content[fieldKey] || [];
                const makeStatDefault = () => ({
                    value: '',
                    suffix: activeLanguages.reduce((acc, l) => ({ ...acc, [l]: '' }), {}),
                    label: activeLanguages.reduce((acc, l) => ({ ...acc, [l]: '' }), {}),
                });
                const addStat = () => handleContentChange(fieldKey, [...stats, makeStatDefault()]);
                const removeStat = (i) => {
                    const next = [...stats];
                    next.splice(i, 1);
                    handleContentChange(fieldKey, next);
                };
                const updateStat = (i, field, lang, val) => {
                    const next = stats.map((s, idx) => {
                        if (idx !== i) return s;
                        if (field === 'value') return { ...s, value: lang };
                        return { ...s, [field]: { ...(s[field] || {}), [lang]: val } };
                    });
                    handleContentChange(fieldKey, next);
                };
                return (
                    <Grid item xs={12} key={fieldKey}>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2">{label}</Typography>
                                <Button size="small" startIcon={<AddIcon />} onClick={addStat}>Add Stat</Button>
                            </Box>
                            {stats.map((stat, i) => (
                                <Paper key={i} variant="outlined" sx={{ p: 2, mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="caption">Stat {i + 1}</Typography>
                                        <IconButton size="small" color="error" onClick={() => removeStat(i)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Value (number)"
                                                value={stat.value ?? ''}
                                                onChange={(e) => updateStat(i, 'value', e.target.value)}
                                                helperText='e.g. "140" or "70 ألف"'
                                            />
                                        </Grid>
                                        {activeLanguages.map((lang) => (
                                            <Grid item xs={12} sm={3} key={`stat-${i}-label-${lang}`}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label={`Label (${lang.toUpperCase()})`}
                                                    value={stat.label?.[lang] ?? ''}
                                                    onChange={(e) => updateStat(i, 'label', lang, e.target.value)}
                                                />
                                            </Grid>
                                        ))}
                                        {activeLanguages.map((lang) => (
                                            <Grid item xs={12} sm={3} key={`stat-${i}-suffix-${lang}`}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label={`Suffix (${lang.toUpperCase()})`}
                                                    value={stat.suffix?.[lang] ?? ''}
                                                    onChange={(e) => updateStat(i, 'suffix', lang, e.target.value)}
                                                    helperText='e.g. "ألف" or "+"'
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            ))}
                            {stats.length === 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                                    No stats added. Click "Add Stat" to begin.
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                );
            }

            default:
                return (
                    <Grid item xs={12} sm={6} md={4} key={fieldKey}>
                        <TextField
                            fullWidth
                            id={`content-${fieldKey}`}
                            label={`${label} (${fieldDef.type})`}
                            value={data.content[fieldKey] ?? ''}
                            onChange={(e) => handleContentChange(fieldKey, e.target.value)}
                            error={!!errors[`content.${fieldKey}`]}
                            helperText={errors[`content.${fieldKey}`] || `Unsupported type: ${fieldDef.type}`}
                        />
                    </Grid>
                );
        }
    };

    return (
        <>
            <Head title={isEditing ? 'Edit Block' : 'Create Block'} />
            <Typography variant="h4" gutterBottom>
                {isEditing
                    ? `Edit Block: ${blockTypes?.[block.block_type]?.label ?? block.block_type}`
                    : `Add Block to: ${getTranslatedFieldLocal(page.title, pageProps)}`}
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={3}>
                        {/* Block Type Selector */}
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.block_type} disabled={isEditing}>
                                <InputLabel id="block-type-label">Block Type</InputLabel>
                                <Select
                                    labelId="block-type-label"
                                    id="block_type"
                                    name="block_type"
                                    value={data.block_type}
                                    label="Block Type"
                                    required
                                    onChange={(e) => handleBlockTypeChange(e.target.value)}
                                >
                                    <MenuItem value=""><em>Select Block Type...</em></MenuItem>
                                    {blockTypeLabels && Object.entries(blockTypeLabels).map(([key, label]) => (
                                        <MenuItem key={key} value={key}>{label}</MenuItem>
                                    ))}
                                </Select>
                                {errors.block_type && <FormHelperText>{errors.block_type}</FormHelperText>}
                                {isEditing && (
                                    <FormHelperText>Block type cannot be changed after creation.</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                id="display_order"
                                label="Display Order"
                                value={data.display_order}
                                onChange={(e) => setData('display_order', Number(e.target.value))}
                                error={!!errors.display_order}
                                helperText={errors.display_order}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.status}>
                                <InputLabel id="block-status-label">Status</InputLabel>
                                <Select
                                    labelId="block-status-label"
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    label="Status"
                                    required
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                </Select>
                                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        {/* Dynamic Content Fields */}
                        {selectedBlockType && Object.keys(currentFields).length > 0 && (
                            <>
                                <Grid item xs={12}>
                                    <Divider>Content Fields</Divider>
                                </Grid>
                                {Object.entries(currentFields).map(([fieldKey, fieldDef]) =>
                                    renderField(fieldKey, fieldDef)
                                )}
                            </>
                        )}

                        {/* Config Section */}
                        <Grid item xs={12}>
                            <Divider>Configuration</Divider>
                        </Grid>

                        {/* Block Style Presets */}
                        {BLOCK_PRESETS[data.block_type] && (
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ mr: 1 }}>Quick Presets:</Typography>
                                {BLOCK_PRESETS[data.block_type].map((preset) => (
                                    <Button
                                        key={preset.label}
                                        size="small"
                                        variant="outlined"
                                        startIcon={<ContentCopyIcon />}
                                        sx={{ mr: 1, mb: 1, textTransform: 'none', fontSize: '0.75rem' }}
                                        onClick={() => {
                                            setData('config', { ...data.config, ...preset.config });
                                        }}
                                    >
                                        {preset.label}
                                    </Button>
                                ))}
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6} md={4}>
                            <ColorPickerField
                                label="Background Color"
                                value={data.config.background_color}
                                onChange={(v) => handleConfigChange('background_color', v)}
                                helperText={errors['config.background_color'] || 'e.g. #ffffff or transparent'}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <ColorPickerField
                                label="Text Color"
                                value={data.config.text_color}
                                onChange={(v) => handleConfigChange('text_color', v)}
                                helperText={errors['config.text_color'] || 'e.g. #000000'}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors['config.padding_y']}>
                                <InputLabel id="config-padding-label">Vertical Padding</InputLabel>
                                <Select
                                    labelId="config-padding-label"
                                    id="config-padding_y"
                                    value={data.config.padding_y}
                                    label="Vertical Padding"
                                    onChange={(e) => handleConfigChange('padding_y', e.target.value)}
                                >
                                    <MenuItem value="none">None</MenuItem>
                                    <MenuItem value="sm">Small</MenuItem>
                                    <MenuItem value="md">Medium</MenuItem>
                                    <MenuItem value="lg">Large</MenuItem>
                                    <MenuItem value="xl">Extra Large</MenuItem>
                                </Select>
                                {errors['config.padding_y'] && <FormHelperText>{errors['config.padding_y']}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={!!data.config.full_width}
                                        onChange={(e) => handleConfigChange('full_width', e.target.checked)}
                                        name="config-full_width"
                                    />
                                }
                                label="Full Width"
                            />
                            {errors['config.full_width'] && (
                                <FormHelperText error>{errors['config.full_width']}</FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                id="config-css_class"
                                label="CSS Class"
                                value={data.config.css_class}
                                onChange={(e) => handleConfigChange('css_class', e.target.value)}
                                error={!!errors['config.css_class']}
                                helperText={errors['config.css_class'] || 'Additional CSS classes'}
                            />
                        </Grid>

                        {/* Block-type-specific config */}
                        {(data.block_type === 'hero_banner' || data.block_type === 'quran_verse') && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="config-layout-label">Layout</InputLabel>
                                    <Select
                                        labelId="config-layout-label"
                                        value={data.config.layout || (data.block_type === 'hero_banner' ? 'centered' : 'overlay')}
                                        label="Layout"
                                        onChange={(e) => handleConfigChange('layout', e.target.value)}
                                    >
                                        {data.block_type === 'hero_banner' ? (
                                            [<MenuItem key="centered" value="centered">Centered</MenuItem>,
                                             <MenuItem key="split" value="split">Split (Portrait + Text)</MenuItem>]
                                        ) : (
                                            [<MenuItem key="overlay" value="overlay">Overlay</MenuItem>,
                                             <MenuItem key="card" value="card">Card on Background</MenuItem>]
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {(data.block_type === 'hero_banner' || data.block_type === 'pillar_cards') && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={!!data.config.show_decorations}
                                            onChange={(e) => handleConfigChange('show_decorations', e.target.checked)}
                                        />
                                    }
                                    label="Show Islamic Decorations"
                                />
                            </Grid>
                        )}

                        {data.block_type === 'hero_banner' && data.config.show_decorations && (
                            <Grid item xs={12} sm={6} md={4}>
                                <ColorPickerField
                                    label="Decoration Color"
                                    value={data.config.decoration_color || '#C9A94E'}
                                    onChange={(v) => handleConfigChange('decoration_color', v)}
                                    helperText="Gold: #C9A94E, White: #ffffff"
                                />
                            </Grid>
                        )}

                        {data.block_type === 'pillar_cards' && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="config-card-variant-label">Card Variant</InputLabel>
                                    <Select
                                        labelId="config-card-variant-label"
                                        value={data.config.card_variant || 'light'}
                                        label="Card Variant"
                                        onChange={(e) => handleConfigChange('card_variant', e.target.value)}
                                    >
                                        <MenuItem value="light">Light</MenuItem>
                                        <MenuItem value="dark">Dark (for dark backgrounds)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {(data.block_type === 'quran_verse' || data.block_type === 'hero_banner') && (
                            <Grid item xs={12} sm={6} md={4}>
                                <ColorPickerField
                                    label="Accent Color"
                                    value={data.config.accent_color || data.config.decoration_color || '#C9A94E'}
                                    onChange={(v) => handleConfigChange('accent_color', v)}
                                    helperText="For ornaments/decorations"
                                />
                            </Grid>
                        )}

                        {/* ornamental_frame toggle for quran_verse */}
                        {data.block_type === 'quran_verse' && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={!!data.config.ornamental_frame}
                                            onChange={(e) => handleConfigChange('ornamental_frame', e.target.checked)}
                                        />
                                    }
                                    label="Ornamental Frame"
                                />
                            </Grid>
                        )}

                        {/* Columns config for grid-based blocks */}
                        {['pillar_cards', 'category_grid', 'latest_news', 'logo_grid', 'stats_counter', 'books_grid'].includes(data.block_type) && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="config-columns-label">Columns</InputLabel>
                                    <Select
                                        labelId="config-columns-label"
                                        value={data.config.columns || 3}
                                        label="Columns"
                                        onChange={(e) => handleConfigChange('columns', Number(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((n) => (
                                            <MenuItem key={n} value={n}>{n} Column{n > 1 ? 's' : ''}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {data.block_type === 'logo_grid' && (
                            <>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Logo Max Height (px)"
                                        type="number"
                                        value={data.config.logo_max_height || 60}
                                        onChange={(e) => handleConfigChange('logo_max_height', parseInt(e.target.value) || 60)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={!!data.config.grayscale}
                                                onChange={(e) => handleConfigChange('grayscale', e.target.checked)}
                                            />
                                        }
                                        label="Grayscale Logos (color on hover)"
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Actions */}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                            <Button
                                component={InertiaLink}
                                href={route('admin.pages.edit', page.id)}
                                variant="outlined"
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={processing || !data.block_type}>
                                {processing ? 'Saving...' : isEditing ? 'Update Block' : 'Create Block'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    );
}

Form.layout = (page) => (
    <AdminLayout
        children={page}
        title={page.props?.block ? 'Edit Block' : 'Create Block'}
    />
);
