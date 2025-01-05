import dayjs, { Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { CircularProgress, Alert, TextField } from "@mui/material";
import { db } from "@/lib/firebase";
import { Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import myProfileState from "../MyProfile.state";
import { observer } from "mobx-react-lite";
import { doc, updateDoc } from "firebase/firestore";
import { UserDocType } from "@/lib/UserList";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { addYearToBirthday } from "@/lib/clientUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxWidth: "95%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

const DOBChangeModal = observer(() => {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
  };

  const userBirthday = myProfileState.user?.birthday;
  const [year, setYear] = useState<number | null>(() => {
    if (userBirthday && userBirthday.startsWith("--")) {
      return null; // No year provided by user
    }
    return dayjs(userBirthday).isValid() ? dayjs(userBirthday).year() : null;
  });
  const [monthDay, setMonthDay] = useState<Dayjs | null>(() => {
    if (userBirthday && userBirthday.startsWith("--")) {
      return dayjs(addYearToBirthday(userBirthday));
    }
    return dayjs(userBirthday).isValid() ? dayjs(userBirthday) : null;
  });

  useEffect(() => {
    if (monthDay) {
      setMonthDay((prev) =>
        prev ? prev.set("year", year || dayjs().year()) : null
      );
    }
  }, [year]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!monthDay) {
      return;
    }

    const formattedDate = year
      ? monthDay.set("year", year).format("YYYY-MM-DD")
      : monthDay.format("--MM-DD"); // Store as "--MM-DD" if no year.

    const userDoc = doc(db, "users", myProfileState.userId!);
    setLoading(true);

    try {
      await updateDoc(userDoc, {
        birthday: formattedDate
      });

      const newState = {
        ...myProfileState.user,
        birthday: formattedDate
      } as UserDocType;
      myProfileState.setUser(newState);

      setSuccess("Birthday updated successfully.");

      setTimeout(() => {
        setSuccess(null);
        handleClose();
      }, 3000);
    } catch (error) {
      setError("Error updating birthday.");
      console.error("Error updating user's birthday: ", error);
    } finally {
      setLoading(false);
    }
  };

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
        onClose={handleClose}
        aria-labelledby="dob-change-modal-title"
        aria-describedby="dob-change-modal-description"
      >
        <Box sx={style}>
          <Typography id="dob-change-modal-title" variant="h2" sx={{ mt: 0 }}>
            Change Birthday
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3
            }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Month and day"
                views={["month", "day"]} // Limit views to month and day only
                value={monthDay}
                onChange={(newValue) => setMonthDay(newValue)}
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true
                  }
                }}
              />
              <DatePicker
                label="Year (optional)"
                value={year ? dayjs().set("year", year) : null} // Convert year to Dayjs
                onChange={
                  (newValue) => setYear(newValue ? newValue.year() : null) // Extract year from Dayjs
                }
                views={["year"]}
              />
            </LocalizationProvider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1
              }}
            >
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={14} />
                ) : (
                  "Update Birthday"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
});

export default DOBChangeModal;
