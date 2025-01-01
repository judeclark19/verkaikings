import Button from "@mui/material/Button";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { observer } from "mobx-react-lite";
import appState from "@/lib/AppState";

const SimpleSnackbar = observer(() => {
  const handleClick = () => {
    appState.setSnackbarOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    // if (reason === "clickaway") {
    //   return;
    // }
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
