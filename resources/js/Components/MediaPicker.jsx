import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { safeUrl } from '@/utils/sanitize';

/**
 * Image picker that combines URL paste, file upload, and a grid of
 * previously uploaded images. Used inside block/setting forms in place of
 * raw image-URL text inputs.
 *
 * Props:
 *   value     — current image URL string
 *   onChange  — (url: string) => void
 *   label     — field label
 *   error / helperText — passed through to TextField
 *   required  — whether the URL field is required (only affects asterisk)
 */
export default function MediaPicker({
    value = '',
    onChange,
    label = 'Image',
    error = false,
    helperText = '',
    required = false,
}) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch(route('admin.media.picker'), {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setItems(Array.isArray(data.items) ? data.items : []);
        } catch (e) {
            setUploadError(`Failed to load library: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchItems();
    }, [open]);

    const handleFile = async (file) => {
        if (!file) return;
        setUploading(true);
        setUploadError('');
        try {
            const fd = new FormData();
            fd.append('file', file);
            const csrf =
                document.querySelector('meta[name="csrf-token"]')?.content || '';
            const res = await fetch(route('admin.media.store'), {
                method: 'POST',
                body: fd,
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `HTTP ${res.status}`);
            }
            const data = await res.json();
            if (data?.url) {
                onChange(data.url);
                setOpen(false);
            }
        } catch (e) {
            setUploadError(`Upload failed: ${e.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handlePick = (url) => {
        onChange(url);
        setOpen(false);
    };

    const handleClear = () => onChange('');

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                    fullWidth
                    required={required}
                    label={label}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Paste a URL or pick from library"
                    error={!!error}
                    helperText={helperText}
                    InputProps={{
                        endAdornment: value ? (
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                aria-label="Clear image"
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        ) : null,
                    }}
                />
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PhotoLibraryIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ mt: 0.5, whiteSpace: 'nowrap' }}
                >
                    Library
                </Button>
            </Box>
            {value && safeUrl(value) !== '#' && (
                <Box
                    component="img"
                    src={safeUrl(value)}
                    alt=""
                    sx={{
                        mt: 1,
                        maxHeight: 80,
                        maxWidth: '100%',
                        borderRadius: 1,
                        border: '1px solid rgba(0,0,0,0.1)',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            )}

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Media Library</DialogTitle>
                <DialogContent dividers>
                    {uploadError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError('')}>
                            {uploadError}
                        </Alert>
                    )}
                    <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploading ? 'Uploading…' : 'Upload new'}
                        </Button>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                handleFile(file);
                                e.target.value = '';
                            }}
                            style={{ display: 'none' }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            JPEG, PNG, GIF, or WebP · max 10 MB
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : items.length === 0 ? (
                        <Typography sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
                            No images yet — upload your first one above.
                        </Typography>
                    ) : (
                        <Grid container spacing={1.5}>
                            {items
                                .filter((it) => it.mime_type?.startsWith('image/'))
                                .map((it) => (
                                    <Grid item xs={6} sm={4} md={3} key={it.id}>
                                        <Box
                                            onClick={() => handlePick(it.url)}
                                            sx={{
                                                cursor: 'pointer',
                                                border: '2px solid transparent',
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                aspectRatio: '1 / 1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0,0,0,0.04)',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={it.thumb_url || it.url}
                                                alt={it.name}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: 'block',
                                                mt: 0.5,
                                                color: 'text.secondary',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                            title={it.name}
                                        >
                                            {it.name}
                                        </Typography>
                                    </Grid>
                                ))}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
