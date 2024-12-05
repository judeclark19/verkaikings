import { Paper, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import ByDay from "./ByDay";
import userList from "@/lib/UserList";

const ByMonth = observer(({ month }: { month: string }) => {
  function getMonthName(monthNumber: number, locale: string) {
    const date = new Date(2022, monthNumber - 1); // Use any non-leap year; January is 0
    return date.toLocaleString(locale, { month: "long" });
  }

  return (
    <Paper
      elevation={8}
      color="secondary"
      sx={{
        padding: 2,
        height: "fit-content"
      }}
    >
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          marginTop: 0,
          color: parseInt(month) % 2 !== 0 ? "primary.dark" : "secondary.dark"
        }}
      >
        {getMonthName(parseInt(month), navigator.language || "en")}
      </Typography>
      <div>
        {Object.keys(userList.usersByBirthday[month])
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((day) => (
            <ByDay key={day} day={day} month={month} />
          ))}
      </div>
    </Paper>
  );
});

export default ByMonth;
