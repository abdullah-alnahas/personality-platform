import React from 'react';
import { Box } from '@mui/material';

/**
 * Horizontal ornamental divider with a center diamond and side lines.
 */
export default function OrnamentalDivider({ color = '#C9A94E', width = 200, opacity = 0.6, sx = {} }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                opacity,
                my: 2,
                ...sx,
            }}
        >
            <Box sx={{ width: width * 0.35, height: 1, bgcolor: color }} />
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    bgcolor: color,
                    transform: 'rotate(45deg)',
                    flexShrink: 0,
                }}
            />
            <Box sx={{ width: width * 0.35, height: 1, bgcolor: color }} />
        </Box>
    );
}
