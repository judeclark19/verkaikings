import { Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function EditBtn({
  setIsEditing
}: {
  setIsEditing: (isEditing: boolean) => void;
}) {
  return (
    <Fab
      size="small"
      color="primary"
      aria-label="edit"
      onClick={() => {
        setIsEditing(true);
      }}
      sx={{
        flexShrink: 0
      }}
    >
      <EditIcon />
    </Fab>
  );
}

export default EditBtn;
