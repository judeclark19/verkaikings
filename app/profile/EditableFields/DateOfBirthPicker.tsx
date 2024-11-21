import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { observer } from "mobx-react-lite";
import myProfileState from "../MyProfile.state";
import SaveBtn from "./SaveBtn";

const DatePickerForm = observer(
  ({
    label,
    setIsEditing
  }: {
    label: string;
    setIsEditing: (state: boolean) => void;
  }) => {
    const [value, setValue] = useState<Dayjs | null>(
      dayjs(myProfileState.user?.birthday)
    );
    const [loading, setLoading] = useState(false);
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      const userDoc = doc(db, "users", myProfileState.userId!);
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
        <SaveBtn loading={loading} />
      </form>
    );
  }
);

export default DatePickerForm;
