import { List, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import UserListItem from "../UserListItem";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";

const ByDay = observer(({ day, month }: { day: string; month: string }) => {
  return (
    <div key={day}>
      <Typography variant="h3">{day}</Typography>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper"
        }}
      >
        {userList.usersByBirthday[month][day].map((user) => (
          <UserListItem key={user.username} user={user} />
        ))}
      </List>
    </div>
  );
});

export default ByDay;
