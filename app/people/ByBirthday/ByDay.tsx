import { List, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import UserListItem from "../UserListItem";
import appState from "@/lib/AppState";

const ByDay = observer(({ day, month }: { day: string; month: string }) => {
  return (
    <div
      key={day}
      style={{
        marginLeft: "2rem"
      }}
    >
      <Typography variant="h3">{day}</Typography>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper"
        }}
      >
        {appState.usersByBirthday[month][day].map((user) => (
          <UserListItem key={user.username} user={user} />
        ))}
      </List>
    </div>
  );
});

export default ByDay;
