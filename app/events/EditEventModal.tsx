import { useState } from "react";
import {
  CircularProgress,
  Alert,
  TextField,
  Fab,
  Tooltip,
  Box,
  Button,
  Typography,
  Modal
} from "@mui/material";
import { auth, db } from "@/lib/firebase";
import {
  LocalizationProvider,
  TimePicker,
  DatePicker
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import LocationPicker from "./LocationPicker";
import { doc, setDoc } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import { EventType } from "./Events.state";

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
  p: 2,
  maxHeight: "95vh",
  overflow: "auto"
};

export default function EditEventModal({
  buttonType = "fab",
  event
}: {
  buttonType?: "fab" | "button";
  event: EventType;
}) {
  // Modal state
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
  };

  // Form fields
  const [title, setTitle] = useState(event.title);
  const [time, setTime] = useState<Dayjs | null>(
    dayjs()
      .hour(parseInt(event.time.split(":")[0]))
      .minute(parseInt(event.time.split(":")[1]))
  );
  const [date, setDate] = useState<Dayjs | null>(dayjs(event.date));
  const [description, setDescription] = useState(event.description);
  const [locationName, setLocationName] = useState(event.locationName);
  const [locationUrl, setLocationUrl] = useState<string | null>(
    event.locationUrl
  );
  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const user = auth.currentUser;
    if (!user) {
      setError("No authenticated user.");
      setLoading(false);
      return;
    }
    try {
      const updatedEventInfo = {
        creatorId: user.uid,
        title,
        createdAt: new Date().toISOString(),
        date: date!.format("YYYY-MM-DD"),
        time: time!.format("HH:mm"),
        locationName,
        locationUrl,
        description,
        attendees: [user.uid]
      };

      // update the event in the database
      const eventDocRef = doc(db, "events", event.id);
      await setDoc(eventDocRef, updatedEventInfo, { merge: true });

      console.log("updated info: ", updatedEventInfo);
      setSuccess("Event updated successfully.");

      setTimeout(() => {
        setSuccess(null);
        handleClose();
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create event.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {buttonType === "fab" ? (
        <Tooltip
          title="Edit this event"
          placement="top"
          arrow
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -8]
                }
              }
            ]
          }}
        >
          <Fab
            size="small"
            color="secondary"
            aria-label="edit"
            onClick={handleOpen}
            sx={{
              flexShrink: 0
            }}
          >
            <EditIcon />
          </Fab>
        </Tooltip>
      ) : (
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Edit this event
        </Button>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="new-event-modal-title"
        aria-describedby="new-event-modal-description"
      >
        <Box sx={style}>
          <Typography id="new-event-modal-title" variant="h2" sx={{ mt: 0 }}>
            Update Event
          </Typography>
          <Typography id="new-event-modal-description" sx={{ mt: 2 }}>
            Update the event details below
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

            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoComplete="title"
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
              />

              <TimePicker
                label="Start Time"
                name="startTime"
                value={time}
                onChange={(newValue) => setTime(newValue)}
                ampm={false}
              />
            </LocalizationProvider>

            <LocationPicker
              setLocationUrl={setLocationUrl}
              locationName={locationName}
              setLocationName={setLocationName}
            />

            <TextField
              label="Description/Additional Info"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoComplete="description"
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 1
              }}
            >
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                sx={{
                  flexGrow: 1,
                  minWidth: "50%"
                }}
              >
                Close
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ flexGrow: 1 }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={14} />
                ) : (
                  "Update event"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
