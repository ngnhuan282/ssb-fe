import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function BusDeleteDialog({
  deleteConfirm,
  lastDeleteData,
  onCancel,
  onConfirm,
}) {
  const target = deleteConfirm || lastDeleteData;

  return (
    <Dialog open={!!deleteConfirm} onClose={onCancel}>
      <DialogTitle sx={{ color: "#dc3545" }}>Xác Nhận Xóa</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc muốn xóa xe {target?.licensePlate}?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Hủy</Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onConfirm(target._id)}
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
