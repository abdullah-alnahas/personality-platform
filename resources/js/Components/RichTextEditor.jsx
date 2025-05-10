import React, { useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import { Box } from "@mui/material";

// Optional: Add support for text direction to the default Quill formats
// This allows the toolbar to have a direction button if needed,
// though Quill often handles RTL input based on content or browser settings.
// const DirectionAttribute = Quill.import('attributors/attribute/direction');
// Quill.register(DirectionAttribute, true);
// const AlignClass = Quill.import('attributors/class/align');
// Quill.register(AlignClass, true);

// Define a standard toolbar configuration
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        ["blockquote", "code-block"],

        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
        [{ direction: "rtl" }], // text direction

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],

        ["link", "image", "video"], // image and video might require server-side handling for uploads

        ["clean"], // remove formatting button
    ],
    //clipboard: {
    //  matchVisual: false, // important for pasting from Word etc.
    //}
};

const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "script",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "direction",
];

const RichTextEditor = ({
    value,
    onChange,
    placeholder,
    direction = "ltr",
    error = false,
    helperText = "",
}) => {
    const quillRef = useRef(null);

    useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            // You can directly manipulate the editor instance here if needed,
            // for example, to set focus or programmatically change content.
            // For direction, Quill often respects the direction of the containing element
            // or the input method.
        }
    }, [direction]);

    return (
        <Box
            sx={{
                "& .ql-editor": {
                    minHeight: "200px", // Default min height
                    direction: direction, // Apply direction to the editor area
                    textAlign: direction === "rtl" ? "right" : "left",
                },
                "& .ql-toolbar": {
                    direction: "ltr", // Toolbar is usually LTR regardless of content direction for consistency
                },
                border: error
                    ? "1px solid red"
                    : "1px solid rgba(0, 0, 0, 0.23)", // Mimic TextField error border
                borderRadius: "4px",
                "&:hover": {
                    borderColor: error ? "red" : "black", // Mimic TextField hover
                },
                "& .ql-container.ql-snow": {
                    border: "none", // Remove Quill's own border as Box provides it
                },
                "& .ql-toolbar.ql-snow": {
                    border: "none", // Remove Quill's own border for toolbar
                    borderBottom: error
                        ? "1px solid red"
                        : "1px solid rgba(0, 0, 0, 0.23)", // Add bottom border to toolbar
                },
            }}
        >
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value || ""}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
            {helperText && (
                <Typography
                    variant="caption"
                    sx={{
                        ml: 2,
                        mt: 1,
                        display: "block",
                        color: error ? "red" : "text.secondary",
                    }}
                >
                    {helperText}
                </Typography>
            )}
        </Box>
    );
};

export default RichTextEditor;
