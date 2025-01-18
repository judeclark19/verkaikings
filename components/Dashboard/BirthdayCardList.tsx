import UserListItem from "@/app/people/UserListItem";
import appState from "@/lib/AppState";
import { formatBirthday2digit } from "@/lib/clientUtils";
import { UserDocType } from "@/lib/UserList";
import { Box, CircularProgress, List, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const BirthdayCardList = observer(
  ({ users, emptyMessage }: { users: UserDocType[]; emptyMessage: string }) => {
    if (!appState.isInitialized) {
      return <CircularProgress />;
    }

    return (
      <>
        {users.length === 0 && (
          <Typography
            sx={{
              color: "text.secondary"
            }}
          >
            {emptyMessage}
          </Typography>
        )}
        <List
          sx={{
            width: "fit-content",
            maxWidth: 360,
            margin: "auto",
            padding: 0
          }}
        >
          {users.length > 0 &&
            users.map((user) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center"
                }}
                key={user.username}
              >
                <div
                  style={{
                    backgroundColor: "rgb(18, 18, 18)"
                  }}
                >
                  <UserListItem user={user} />
                </div>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    paddingRight: "1rem"
                  }}
                >
                  &nbsp; -{" "}
                  {formatBirthday2digit(user.birthday!, appState.language)}
                </div>
              </Box>
            ))}
        </List>
      </>
    );
  }
);

export default BirthdayCardList;
