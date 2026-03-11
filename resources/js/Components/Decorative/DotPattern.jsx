import React from 'react';
import { Box } from '@mui/material';

/**
 * Grid of small dots as a decorative background pattern.
 */
export default function DotPattern({
    color = '#C9A94E',
    dotSize = 3,
    gap = 20,
    opacity = 0.1,
    sx = {},
}) {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity,
                backgroundImage: `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`,
                backgroundSize: `${gap}px ${gap}px`,
                zIndex: 1,
                ...sx,
            }}
        />
    );
}
