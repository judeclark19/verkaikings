// need to make editing possible
// check editing modal in mobile to see if it overflows

import {
  Box,
  Link as MuiLink,
  List,
  Paper,
  Typography,
  Button,
  Divider
} from "@mui/material";
import { EventType } from "./Events.state";
import { formatFullBirthday } from "@/lib/clientUtils";
import userList from "@/lib/UserList";
import UserListItem from "../people/UserListItem";
import appState from "@/lib/AppState";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

const Event = ({
  event,
  showTitle = true
}: {
  event: EventType;
  showTitle?: boolean;
}) => {
  const imGoing = event.attendees.includes(appState.loggedInUser!.id);

  async function updateAttendance() {
    try {
      const eventDocRef = doc(db, "events", event.id);

      const updatedAttendees = imGoing
        ? event.attendees.filter((id) => id !== appState.loggedInUser!.id) // Remove the current user
        : [...event.attendees, appState.loggedInUser!.id]; // Add the current user

      await updateDoc(eventDocRef, {
        attendees: updatedAttendees
      });
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  }

  return (
    <Paper
      elevation={5}
      sx={{
        p: 2
      }}
      id={event.id}
    >
      {showTitle && (
        <>
          <Link
            href={`/events/${event.id}`}
            passHref
            style={{
              color: "#A3AE6A",
              textDecoration: "underline", // Ensures underline is applied
              textDecorationColor: "#A3AE6A" // Matches underline color to text color
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
          </Link>
          <Divider
            sx={{
              mb: 2
            }}
          />
        </>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr 1fr"
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
            <MuiLink href={event.locationUrl} target="_blank">
              {event.locationName}
            </MuiLink>
          </Typography>
          {event.description && (
            <Typography>
              <strong>Description:</strong> {event.description}
            </Typography>
          )}
        </Box>
        <Divider
          orientation="vertical"
          sx={{
            display: {
              xs: "none",
              sm: "block"
            }
          }}
        />
        <Divider
          sx={{
            display: {
              xs: "block",
              sm: "none"
            }
          }}
        />
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
          <Button
            variant="contained"
            color={imGoing ? "secondary" : "primary"}
            onClick={updateAttendance}
            startIcon={imGoing ? <CloseIcon /> : <AddIcon />}
          >
            {imGoing ? "I'm not going." : "I'm going!"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default Event;
