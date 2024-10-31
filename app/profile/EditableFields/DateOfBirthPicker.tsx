import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { doc, updateDoc, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";

const DatePickerForm = observer(
  ({
    label,
    userId,

    setIsEditing
  }: {
    label: string;
    userId: string;

    setIsEditing: (state: boolean) => void;
  }) => {
    const [value, setValue] = useState<Dayjs | null>(
      dayjs(myProfileState.user?.birthday)
    );
    const [loading, setLoading] = useState(false);
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      const userDoc = doc(db, "users", userId);
      setLoading(true);
      updateDoc(userDoc, {
        birthday: value ? value.format("YYYY-MM-DD") : null
      })
        .then(() => {
          // TODO: visual feedback
          console.log("User's birthday updated successfully");
          setLoading(false);
          setIsEditing(false);
          myProfileState.setUser({
            ...myProfileState.user,
            birthday: value ? value.format("YYYY-MM-DD") : null
          });
        })
        .catch((error) => {
          console.error("Error updating user's birthday: ", error);
          setLoading(false);
          setIsEditing(false);
        });
    };

    return (
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </LocalizationProvider>
        <Button type="submit" variant="contained">
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Save"
          )}
        </Button>
      </form>
    );
  }
);

export default DatePickerForm;
