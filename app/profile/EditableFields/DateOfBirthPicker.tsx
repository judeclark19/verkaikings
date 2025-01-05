import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import SaveBtn from "./SaveBtn";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import myProfileState from "../MyProfile.state";
import appState from "@/lib/AppState";
import { UserDocType } from "@/lib/UserList";
import { addYearToBirthday } from "@/lib/clientUtils";

const BirthdayPickerForm = ({
  label,
  setIsEditing
}: {
  label: string;
  setIsEditing: (state: boolean) => void;
}) => {
  const userBirthday = myProfileState.user?.birthday;

  const [monthDay, setMonthDay] = useState<Dayjs | null>(() => {
    if (userBirthday && userBirthday.startsWith("--")) {
      return dayjs(addYearToBirthday(userBirthday));
    }
    return dayjs(userBirthday).isValid() ? dayjs(userBirthday) : null;
  });

  const [year, setYear] = useState<number | null>(() => {
    if (userBirthday && userBirthday.startsWith("--")) {
      return null; // No year provided by user
    }
    return dayjs(userBirthday).isValid() ? dayjs(userBirthday).year() : null;
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!monthDay) {
      appState.setSnackbarMessage("Please select month and day.");
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
      appState.setSnackbarMessage("Birthday updated successfully.");

      const newState = {
        ...myProfileState.user,
        birthday: formattedDate
      } as UserDocType;
      myProfileState.setUser(newState);
      setIsEditing(false);
    } catch (error) {
      appState.setSnackbarMessage("Error updating birthday.");
      console.error("Error updating user's birthday: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(
      "dob picker year",
      year,
      dayjs(myProfileState.user?.birthday).year(),
      myProfileState.user?.birthday
    );
  }, [year]);

  useEffect(() => {
    console.log("dob picker monthDay changed", monthDay);
  }, [monthDay]);

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          views={["month", "day"]} // Limit views to month and day only
          value={monthDay}
          onChange={(newValue) => setMonthDay(newValue)}
          slots={{ textField: TextField }} // Replace `renderInput` with `slots`
          slotProps={{
            textField: { fullWidth: true }
          }}
        />
      </LocalizationProvider>
      <TextField
        label="Year (optional)"
        type="number"
        fullWidth
        value={year ?? ""}
        onChange={(e) =>
          setYear(e.target.value ? Number(e.target.value) : null)
        }
        placeholder="Optional"
      />
      <SaveBtn loading={loading} />
    </form>
  );
};

export default BirthdayPickerForm;
