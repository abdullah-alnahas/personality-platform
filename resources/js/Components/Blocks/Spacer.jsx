import React from "react";
import { Box } from "@mui/material";

export default function Spacer({ block }) {
    const config = block?.config || {};
    const height = config.height || 48;

    return (
        <Box
            sx={{
                height: `${height}px`,
                backgroundColor: config.background_color || "transparent",
                width: "100%",
            }}
        />
    );
}
