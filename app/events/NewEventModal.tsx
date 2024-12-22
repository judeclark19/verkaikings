import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { CircularProgress, Alert, TextField } from "@mui/material";
import { auth, db } from "@/lib/firebase"; // Adjust path to your Firebase setup
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LocationPicker from "./LocationPicker";
import { collection, doc, setDoc } from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

export default function NewEventModal() {
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
  const [location, setLocation] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [description, setDescription] = useState("");

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

    console.log("tried to submit with location", location);
    try {
      // do stuff
      const newEvent = {
        creatorId: user.uid,
        title,
        createdAt: new Date().toISOString(),
        date: date!.format("YYYY-MM-DD"),
        time: time!.format("HH:mm"),
        locationName: location?.name || "",
        locationUrl: location?.url || "",
        description,
        attendees: [user.uid]
      };
      console.log("new event: ", newEvent);

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
      <Button variant="contained" color="secondary" onClick={handleOpen}>
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

            <LocationPicker location={location} setLocation={setLocation} />

            <TextField
              label="Description/Additional Info"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              //   required
              autoComplete="description"
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
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
                  "Submit new event"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
