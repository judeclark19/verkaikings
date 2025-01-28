import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";

const SimpleSnackbar = observer(() => {
  const handleClose = () => {
    appState.setSnackbarOpen(false);
  };

  return (
    <div>
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar
        open={appState.snackbarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
        message={appState.snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="secondary"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        ContentProps={{
          sx: {
            background: "#333333",
            color: "text.primary"
          }
        }}
      />
    </div>
  );
});

export default SimpleSnackbar;
