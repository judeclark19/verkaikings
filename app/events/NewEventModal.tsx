import { useState } from "react";
import {
  CircularProgress,
  Alert,
  TextField,
  Button,
  Modal,
  Box,
  Typography
} from "@mui/material";
import { auth, db } from "@/lib/firebase";
import {
  LocalizationProvider,
  TimePicker,
  DatePicker
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { collection, doc, setDoc } from "firebase/firestore";
import { Add as AddIcon } from "@mui/icons-material";
import appState from "@/lib/AppState";
import { observer } from "mobx-react-lite";
import LocationPicker from "./LocationPicker";

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

const NewEventModal = observer(() => {
  // Modal state
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setSuccess(null);
  };

  // Form fields
  const [title, setTitle] = useState("");
  const [time, setTime] = useState<Dayjs | null>(dayjs().hour(20).minute(0)); // Default to today, 20:00
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [locationUrl, setLocationUrl] = useState<string | null>(null);
  const [externalLink, setExternalLink] = useState<string | null>("");

  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");

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
      // do stuff
      const newEvent = {
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

      // create a new event in the database
      const eventsCollectionRef = collection(db, "events");
      const newEventDocRef = doc(eventsCollectionRef); // Automatically generates a unique ID
      await setDoc(newEventDocRef, newEvent);

      setSuccess("Event created successfully.");

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
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpen}
        startIcon={<AddIcon />}
      >
        Add new event
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="new-event-modal-title"
        aria-describedby="new-event-modal-description"
      >
        <Box sx={style}>
          <Typography id="new-event-modal-title" variant="h2" sx={{ mt: 0 }}>
            New Event
          </Typography>
          <Typography id="new-event-modal-description" sx={{ mt: 2 }}>
            Enter new event details below
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

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={appState.dayJsLocale}
            >
              <DatePicker
                label="Date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{
                  textField: {
                    required: true
                  }
                }}
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
              setLocationName={setLocationName}
            />

            <TextField
              label="External Link"
              variant="outlined"
              fullWidth
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              helperText="Usually link to buy tickets, or some other relevant page about the event"
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
                  "Submit new event"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
});

export default NewEventModal;
