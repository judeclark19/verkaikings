import PieChartIcon from "@mui/icons-material/PieChart";
import { Fab, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

function ContactItem({
  initialValue,
  icon
}: {
  initialValue: string;
  icon?: React.ReactNode;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "76px"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%"
        }}
      >
        {icon ? icon : <PieChartIcon />}

        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsEditing(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexGrow: 1
            }}
          >
            <TextField
              label="Enter your value"
              variant="outlined"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              sx={{ margin: "10px 0", width: "100%" }}
            />
            <Fab
              size="small"
              type="submit"
              color="secondary"
              aria-label="save"
              sx={{
                flexShrink: 0
              }}
            >
              <SaveIcon />
            </Fab>
          </form>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "14px"
            }}
          >
            <Typography>{value}</Typography>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactItem;
