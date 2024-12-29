import { List, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import UserListItem from "../UserListItem";
import userList from "@/lib/UserList";

const ByDay = observer(
  ({ day, month, color }: { day: string; month: string; color: string }) => {
    return (
      <div key={day}>
        <Typography
          variant="h3"
          sx={{
            color: color
          }}
        >
          {day}
        </Typography>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            padding: 0
          }}
        >
          {userList.usersByBirthday[month][day].map((user) => (
            <UserListItem key={user.username} user={user} />
          ))}
        </List>
      </div>
    );
  }
);

export default ByDay;
