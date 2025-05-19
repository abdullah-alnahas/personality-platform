import React, { useRef, useState } from "react"; // Added React for useState
import { useForm } from "@inertiajs/react";
import {
    Button,
    TextField,
    Box,
    Typography,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy, // Renamed 'delete' to 'destroy' from useForm
        processing,
        reset,
        errors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(), // Added optional chaining
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <Box component="section" className={className} sx={{ maxWidth: "xl" }}>
            {" "}
            {/* Use sx for max-width if needed */}
            <header>
                <Typography variant="h6" component="h2" gutterBottom>
                    Delete Account
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </Typography>
            </header>
            <Button
                variant="contained"
                color="error"
                onClick={confirmUserDeletion}
            >
                Delete Account
            </Button>
            <Dialog
                open={confirmingUserDeletion}
                onClose={closeModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Are you sure you want to delete your account?
                </DialogTitle>
                <form onSubmit={deleteUser}>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 2 }}>
                            Once your account is deleted, all of its resources
                            and data will be permanently deleted. Please enter
                            your password to confirm you would like to
                            permanently delete your account.
                        </DialogContentText>
                        <TextField
                            fullWidth
                            id="password-delete" // Changed id to avoid potential conflict
                            name="password"
                            type="password"
                            label="Password"
                            inputRef={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={processing}
                            autoFocus
                            margin="dense"
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button
                            onClick={closeModal}
                            color="inherit"
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="error"
                            disabled={processing}
                        >
                            Delete Account
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
