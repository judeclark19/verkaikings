import {
  List,
  ListSubheader,
  ListItem,
  Paper,
  Typography
} from "@mui/material";
import UserListItem from "../UserListItem";
import { UserDocType } from "@/lib/UserList";

function ByLetter({
  letter,
  groupedUsers
}: {
  letter: string;
  groupedUsers: Record<string, UserDocType[]>;
}) {
  return (
    <ListItem
      key={letter}
      sx={{
        width: "100%",
        height: "fit-content",
        padding: "4px"
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          height: "100%",
          padding: "1rem"
        }}
      >
        <List>
          <ListSubheader
            sx={{
              backgroundColor: "transparent",
              color:
                letter.charCodeAt(0) % 2 !== 0
                  ? "primary.dark"
                  : "secondary.dark"
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                mt: 0,
                textAlign: "center"
              }}
            >
              {letter}
            </Typography>
          </ListSubheader>
          <div
            style={{
              backgroundColor: "rgb(18, 18, 18)"
            }}
          >
            {groupedUsers[letter].map((user: UserDocType) => (
              <UserListItem key={user.username} user={user} />
            ))}
          </div>
        </List>
      </Paper>
    </ListItem>
  );
}

export default ByLetter;
