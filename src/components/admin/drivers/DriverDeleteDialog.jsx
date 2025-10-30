import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
  Fade,
} from "@mui/material";

export default function DriverDeleteDialog({
  deleteConfirm,
  lastDeleteData,
  onCancel,
  onConfirm,
}) {
  return (
    <>
      <Dialog
        open={!!deleteConfirm}
        onClose={onCancel}
        TransitionComponent={Fade}
        keepMounted
      >
        <DialogTitle component="div">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Xác nhận xóa tài xế
        </Typography>
      </DialogTitle>
        <Box sx={{ px: 3, pb: 2 }}>
          <Typography>
            Bạn có chắc chắn muốn xóa{" "}
            <strong>{deleteConfirm?.fullName}</strong> khỏi danh sách không?
          </Typography>
        </Box>
        <DialogActions>
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ẩn hoàn toàn phần hiển thị thông tin đã xóa */}
      {false && lastDeleteData && (
        <Box
          sx={{
            mt: 2,
            textAlign: "center",
            color: "gray",
            fontSize: 14,
          }}
        >
          <Typography variant="body2">
            Đã xóa tài xế <strong>{lastDeleteData.fullName}</strong> lúc{" "}
            {lastDeleteData.deletedAt}
          </Typography>
        </Box>
      )}
    </>
  );
}
