import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

export default function ScheduleDeleteDialog({
    deleteConfirm,
    onCancel,
    onConfirm,
}) {
    const target = deleteConfirm;
    return (
        <Dialog open={!!deleteConfirm} onClose={onCancel}>
            <DialogTitle sx={{ color: "#dc3545" }}>Xác Nhận Xóa</DialogTitle>
            <DialogContent>
                <Typography>
                    Bạn có chắc muốn xóa lịch trinh này ?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Hủy</Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => onConfirm(target)}
                >
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
}
