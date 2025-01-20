import { Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const GoBack = () => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<ArrowBackIcon />}
      onClick={() => window.history.back()}
    >
      Go Back
    </Button>
  );
};

export default GoBack;
