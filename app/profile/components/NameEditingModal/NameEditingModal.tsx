import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Fab, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import NameEditingForm from "./NameEditingForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  width: 400
};

const NameEditingModal = observer(() => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Fab
        size="small"
        color="secondary"
        aria-label="edit"
        onClick={handleOpen}
        sx={{
          flexShrink: 0
        }}
      >
        <EditIcon />
      </Fab>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <Typography variant="h2">Edit Name</Typography>
          <Typography>
            Your username is derived from your name using the format
            &ldquo;First_Last&rdquo;.
          </Typography>
          <NameEditingForm closeModal={handleClose} />
        </Box>
      </Modal>
    </div>
  );
});

export default NameEditingModal;
