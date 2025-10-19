// src/components/StudentSelectDialog.jsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
} from "@mui/material";

export default function StudentSelectDialog({
    open,
    students,
    selectedStudents,
    onToggleStudent,
    onClose,
}) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chọn học sinh</DialogTitle>
            <DialogContent>
                <Stack spacing={1}>
                    {students.map((st) => (
                        <Button
                            key={st._id}
                            variant={selectedStudents.includes(st._id) ? "contained" : "outlined"}
                            onClick={() => onToggleStudent(st._id)}
                            fullWidth
                            sx={{
                                justifyContent: "flex-start",
                                borderRadius: 2,
                            }}
                        >
                            {st.fullName}, Lớp {st.class}, Điểm đón: {st.pickupPoint}
                        </Button>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Xong
                </Button>
            </DialogActions>
        </Dialog>
    );
}
