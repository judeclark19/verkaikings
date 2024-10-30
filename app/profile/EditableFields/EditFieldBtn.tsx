import { Button } from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";

function EditFieldBtn({ setState }: { setState: (state: boolean) => void }) {
  return (
    <Button
      variant="contained"
      color={"primary"}
      onClick={() => setState(true)}
    >
      <EditIcon />
    </Button>
  );
}

export default EditFieldBtn;
