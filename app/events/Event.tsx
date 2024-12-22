import { Box, Link, List, Paper, Typography, Button } from "@mui/material";
import { EventType } from "./Events.state";
import { formatFullBirthday } from "@/lib/clientUtils";
import userList from "@/lib/UserList";
import UserListItem from "../people/UserListItem";
import appState from "@/lib/AppState";

const Event = ({ event }: { event: EventType }) => {
  const imGoing = event.attendees.includes(appState.loggedInUser!.id);

  function updateAttendance() {
    console.log("idk");
  }

  return (
    <Paper
      elevation={5}
      sx={{
        p: 2
      }}
    >
      <Typography
        variant="h3"
        sx={{
          marginTop: 0,
          fontSize: "2rem",
          color: "secondary.dark"
        }}
      >
        {event.title} - {formatFullBirthday(event.date)}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr"
          },
          columnGap: 2,
          rowGap: 2
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              marginTop: 0,
              marginBottom: 0.5,

              fontSize: "1.5rem"
            }}
          >
            Event Details
          </Typography>
          <Typography>
            <strong>Date:</strong> {formatFullBirthday(event.date)}
          </Typography>
          <Typography>
            <strong>Time:</strong> {event.time}
          </Typography>
          <Typography>
            <strong>Location:</strong>{" "}
            <Link href={event.locationUrl} target="_blank">
              {event.locationName}
            </Link>
          </Typography>
          {event.description && (
            <Typography>
              <strong>Description:</strong> {event.description}
            </Typography>
          )}
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{
              marginTop: 0,
              marginBottom: 0.5,

              fontSize: "1.5rem"
            }}
          >
            Who's Going?
          </Typography>
          {event.attendees.length === 0 ? (
            <Typography
              sx={{
                mb: 1
              }}
            >
              Nobody yet!
            </Typography>
          ) : (
            <List>
              {event.attendees.map((attendee) => {
                const user = userList.users.find(
                  (user) => user.id === attendee
                );
                if (!user) {
                  return null;
                }
                return <UserListItem key={attendee} user={user} />;
              })}
            </List>
          )}
          {/* <br /> */}
          <Button
            variant="contained"
            color={imGoing ? "secondary" : "primary"}
            onClick={updateAttendance}
          >
            {imGoing ? "I'm not going." : "I'm going!"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Event;
