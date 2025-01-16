import { Box, Button, List } from "@mui/material";
import { EventDocType } from "./Events.state";
import userList from "@/lib/UserList";
import { observer } from "mobx-react-lite";
import UserListItem from "../people/UserListItem";
import Tooltip from "@/components/Tooltip";
import appState from "@/lib/AppState";
import { Close as CloseIcon } from "@mui/icons-material";

const FullAttendeeList = observer(
  ({
    event,
    isPast,
    updateAttendance
  }: {
    event: EventDocType;
    isPast: boolean;
    updateAttendance: () => void;
  }) => {
    return (
      <List
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          marginLeft: {
            xs: "auto",
            md: "-1rem"
          }
        }}
      >
        {event.attendees.map((attendee) => {
          const user = userList.users.find((user) => user.id === attendee);
          if (!user) {
            return null;
          }

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center"
              }}
              key={attendee}
            >
              <UserListItem key={attendee} user={user} />
              {!isPast && user.id === appState.loggedInUser!.id && (
                <Tooltip title="I'm not going" offset={-8}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      padding: "4px",
                      minWidth: 0,
                      width: "30px",
                      height: "30px",
                      marginLeft: "0.5rem"
                    }}
                    onClick={updateAttendance}
                  >
                    <CloseIcon />
                  </Button>
                </Tooltip>
              )}
            </Box>
          );
        })}
      </List>
    );
  }
);

export default FullAttendeeList;
