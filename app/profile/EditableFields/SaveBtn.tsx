import SaveIcon from "@mui/icons-material/Save";
import { CircularProgress, Fab } from "@mui/material";

function SaveBtn({ loading }: { loading: boolean }) {
  return (
    <Fab
      type="submit"
      color="secondary"
      size="medium"
      aria-label="save"
      sx={{
        flexShrink: 0
      }}
    >
      {loading ? (
        <CircularProgress size={24} sx={{ color: "white" }} />
      ) : (
        <SaveIcon />
      )}
    </Fab>
  );
}

export default SaveBtn;
