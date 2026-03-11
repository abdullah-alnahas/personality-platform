import React from 'react';
import { Box } from '@mui/material';

/**
 * 8-pointed Islamic star (Rub el Hizb inspired).
 * Two overlapping squares rotated 45 degrees.
 */
export default function IslamicStar({ size = 40, color = '#C9A94E', opacity = 0.3, sx = {} }) {
    const half = size / 2;
    const innerSize = size * 0.72;
    const innerHalf = innerSize / 2;

    return (
        <Box
            sx={{
                width: size,
                height: size,
                position: 'relative',
                opacity,
                flexShrink: 0,
                ...sx,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: half - innerHalf,
                    left: half - innerHalf,
                    width: innerSize,
                    height: innerSize,
                    backgroundColor: color,
                    transform: 'rotate(0deg)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: half - innerHalf,
                    left: half - innerHalf,
                    width: innerSize,
                    height: innerSize,
                    backgroundColor: color,
                    transform: 'rotate(45deg)',
                }}
            />
        </Box>
    );
}
