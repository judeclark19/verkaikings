import { Modal } from "@mui/material";
import { useState } from "react";
import { Fab } from "@mui/material";
import { observer } from "mobx-react-lite";
import EditIcon from "@mui/icons-material/Edit";
import EmailChangeForm from "./EmailChangeForm";

const EmailChangeModal = observer(() => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Fab
        size="small"
        color="secondary"
        aria-label="edit"
        onClick={() => {
          setOpen(true);
        }}
        sx={{
          flexShrink: 0
        }}
      >
        <EditIcon />
      </Fab>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="email-change-modal-title"
        aria-describedby="email-change-modal-description"
      >
        <div>
          <EmailChangeForm
            closeModal={() => {
              setOpen(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
});

export default EmailChangeModal;
