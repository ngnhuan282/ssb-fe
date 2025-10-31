import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function RouteDeleteDialog({ deleteConfirm, onCancel, onConfirm }) {

  return (
    <Dialog open={!!deleteConfirm} onClose={onCancel}>
      <DialogTitle sx={{ color: "#dc3545" }}>Xác Nhận Xóa</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc muốn xóa tuyến {deleteConfirm?.name}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Hủy</Button>
        <Button variant="contained" color="error" onClick={() => onConfirm()}>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
