import SaveIcon from "@mui/icons-material/Save";
import { CircularProgress, Fab } from "@mui/material";

function SaveBtn({ loading }: { loading: boolean }) {
  return (
    <Fab
      type="submit"
      color="secondary"
      size="small"
      aria-label="save"
      sx={{
        flexShrink: 0
      }}
    >
      {loading ? (
        <CircularProgress color="secondary" size={24} />
      ) : (
        <SaveIcon />
      )}
    </Fab>
  );
}

export default SaveBtn;
