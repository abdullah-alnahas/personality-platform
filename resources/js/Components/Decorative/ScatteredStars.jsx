import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import IslamicStar from './IslamicStar';

/**
 * Scatters Islamic star decorations across a container.
 * Used as an absolute-positioned overlay in hero/section blocks.
 * Stars are placed pseudo-randomly based on a seed for consistency.
 */
export default function ScatteredStars({
    count = 8,
    color = '#C9A94E',
    minSize = 12,
    maxSize = 48,
    opacity = 0.15,
    seed = 42,
    sx = {},
}) {
    const stars = useMemo(() => {
        const result = [];
        // Simple seeded pseudo-random for consistent placement
        let s = seed;
        const rand = () => {
            s = (s * 16807 + 0) % 2147483647;
            return (s - 1) / 2147483646;
        };

        for (let i = 0; i < count; i++) {
            result.push({
                top: `${rand() * 90}%`,
                left: `${rand() * 90}%`,
                size: minSize + rand() * (maxSize - minSize),
                starOpacity: 0.5 + rand() * 0.5,
                rotation: rand() * 45,
            });
        }
        return result;
    }, [count, minSize, maxSize, seed]);

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 1,
                ...sx,
            }}
        >
            {stars.map((star, i) => (
                <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        top: star.top,
                        left: star.left,
                        transform: `rotate(${star.rotation}deg)`,
                    }}
                >
                    <IslamicStar
                        size={star.size}
                        color={color}
                        opacity={opacity * star.starOpacity}
                    />
                </Box>
            ))}
        </Box>
    );
}
