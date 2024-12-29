import { Paper, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import ByDay from "./ByDay";
import userList from "@/lib/UserList";

const ByMonth = observer(({ month }: { month: string }) => {
  function getMonthName(monthNumber: number, locale: string) {
    const date = new Date(2022, monthNumber - 1); // Use any non-leap year; January is 0
    return date.toLocaleString(locale, { month: "long" });
  }

  const color = parseInt(month) % 2 !== 0 ? "primary.dark" : "secondary.dark";

  return (
    <Paper
      sx={{
        padding: 2,
        height: "fit-content",
        // backgroundColor: color,

        borderRadius: "4px"
      }}
    >
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          marginTop: 0,
          // color: "background.default"
          color
        }}
      >
        {getMonthName(parseInt(month), navigator.language || "en")}
      </Typography>
      <div>
        {Object.keys(userList.usersByBirthday[month])
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((day) => (
            <ByDay key={day} day={day} month={month} color={color} />
          ))}
      </div>
    </Paper>
  );
});

export default ByMonth;
