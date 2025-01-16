import {
  Box,
  Link as MuiLink,
  Paper,
  Typography,
  Button,
  Divider,
  Fab,
  Collapse
} from "@mui/material";
import eventsState, { EventDocType } from "./Events.state";
import { formatFullBirthday, sendNotification } from "@/lib/clientUtils";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@mui/icons-material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import EditEventModal from "./EditEventModal";
import EventComments from "./EventComments";
import AttendeeAvatars from "./AttendeeAvatars";
import FullAttendeeList from "./FullAttendeeList";
import { useState } from "react";

const Event = ({
  event,
  showTitle = true
}: {
  event: EventDocType;
  showTitle?: boolean;
}) => {
  const imGoing = event.attendees.includes(appState.loggedInUser!.id);
  const isOwn = event.creatorId === appState.loggedInUser?.id;
  const isPast = eventsState.pastEvents.find((e) => e.id === event.id);
  const creator = userList.users.find((user) => user.id === event.creatorId);

  const [attendeesExpanded, setAttendeesExpanded] = useState(false);

  async function updateAttendance() {
    try {
      const eventDocRef = doc(db, "events", event.id);

      const notify = !imGoing && !isOwn;

      const updatedAttendees = imGoing
        ? event.attendees.filter((id) => id !== appState.loggedInUser!.id) // Remove the current user
        : [...event.attendees, appState.loggedInUser!.id]; // Add the current user

      await updateDoc(eventDocRef, {
        attendees: updatedAttendees
      });

      // send notification to the creator
      if (notify) {
        sendNotification(
          event.creatorId,
          `${appState.loggedInUser!.firstName} ${
            appState.loggedInUser!.lastName
          } is going to your event.`,
          `${appState.loggedInUser!.firstName} is going to your event: ${
            event.title
          }`,
          `/events/${event.id}`
        );
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  }

  async function deleteEvent() {
    if (confirm("Are you sure you want to delete this event?")) {
      await eventsState.deleteEvent(event.id);
    }
  }

  return (
    <Paper
      elevation={5}
      sx={{
        p: 2,
        width: "100%",
        maxWidth: 670,
        height: "fit-content"
      }}
      id={event.id}
    >
      {/* TITLE */}
      {showTitle && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography
              variant="h3"
              component={Link}
              href={`/events/${event.id}`}
              sx={{
                marginTop: 0,
                fontSize: "2rem",
                color: "secondary.dark",
                textDecoration: "none",

                "&:hover": {
                  textDecoration: "underline"
                }
              }}
            >
              {event.title} - {formatFullBirthday(event.date)}
            </Typography>
            {isOwn && isPast && (
              <Fab
                size="small"
                color="secondary"
                aria-label="edit"
                onClick={deleteEvent}
                sx={{
                  flexShrink: 0
                }}
              >
                <DeleteIcon />
              </Fab>
            )}
            {isOwn && !isPast && <EditEventModal event={event} />}
          </Box>
        </>
      )}

      {/* CREATOR */}
      {creator && (
        <Typography>
          Event created by{" "}
          <MuiLink component={Link} href={`/profile/${creator?.username}`}>
            {creator?.firstName} {creator?.lastName}
          </MuiLink>
        </Typography>
      )}

      {/* EVENT BODY */}
      <Box
        sx={{
          display: "flex",
          columnGap: 4,
          rowGap: 2,
          mt: 2,
          mb: 2,
          flexDirection: {
            xs: "column",
            sm: "row"
          }
        }}
      >
        {/* EVENT DETAILS */}
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "50%"
            }
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginTop: 0,
              marginBottom: 0.5,

              fontSize: "1.7rem"
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
            {event.locationUrl ? (
              <MuiLink href={event.locationUrl} target="_blank">
                {event.locationName}
              </MuiLink>
            ) : (
              event.locationName || (
                <span
                  style={{
                    fontStyle: "italic",
                    color: "rgba(255, 255, 255, 0.7)"
                  }}
                >
                  (None)
                </span>
              )
            )}
          </Typography>

          {event.externalLink && (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <strong>External Link:</strong>

              <Button
                href={event.externalLink}
                target="_blank"
                variant="outlined"
                startIcon={<OpenInNewIcon />}
                sx={{ textTransform: "none" }}
              >
                Event web page
              </Button>
            </Typography>
          )}

          {!event.externalLink && isOwn && (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <strong>External Link:</strong>{" "}
              <span
                style={{
                  fontStyle: "italic",
                  color: "rgba(255, 255, 255, 0.7)"
                }}
              >
                (None)
              </span>
            </Typography>
          )}

          {event.description && (
            <Typography>
              <strong>Description:</strong> {event.description || "(None)"}
            </Typography>
          )}

          {!event.description && isOwn && (
            <Typography>
              <strong>Description:</strong>{" "}
              <span
                style={{
                  fontStyle: "italic",
                  color: "rgba(255, 255, 255, 0.7)"
                }}
              >
                (None)
              </span>
            </Typography>
          )}
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: {
              xs: "none",
              sm: "block"
            }
          }}
        />
        <Divider
          orientation="horizontal"
          flexItem
          sx={{
            display: {
              xs: "block",
              sm: "none"
            }
          }}
        />
        {/* ATTENDEES */}
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "50%"
            }
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginTop: 0,
              marginBottom: 0.5,

              fontSize: "1.7rem"
            }}
          >
            {isPast ? "Attendees" : "Who's Going?"}
          </Typography>
          {event.attendees.length === 0 && (
            <Typography
              sx={{
                mb: 1
              }}
            >
              Nobody yet!
            </Typography>
          )}
          <Box
            sx={{
              overflow: "hidden",
              mb: 2
            }}
          >
            <Collapse
              in={attendeesExpanded}
              timeout={500}
              collapsedSize="52px"
              sx={{
                position: "relative"
              }}
            >
              <Box
                sx={{
                  opacity: attendeesExpanded ? 0 : 1,
                  transition: "opacity 0.3s ease",
                  height: "52px",
                  display: attendeesExpanded ? "none" : "flex"
                }}
              >
                <AttendeeAvatars event={event} />
              </Box>
              <Box
                sx={{
                  opacity: attendeesExpanded ? 1 : 0,
                  transition: "opacity 0.3s ease"
                }}
              >
                <FullAttendeeList
                  event={event}
                  isPast={!!isPast}
                  updateAttendance={updateAttendance}
                />
              </Box>
            </Collapse>
            <Button
              variant="outlined"
              fullWidth
              endIcon={
                attendeesExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
              }
              sx={{ mt: 1 }}
              onClick={() => setAttendeesExpanded(!attendeesExpanded)}
            >
              {attendeesExpanded ? "Collapse" : "Expand"}
            </Button>
          </Box>

          <Button
            variant="contained"
            color={imGoing ? "secondary" : "primary"}
            onClick={updateAttendance}
            startIcon={imGoing ? <CloseIcon /> : <AddIcon />}
            sx={{
              width: {
                xs: "100%",
                sm: "170px"
              },
              maxWidth: 400
            }}
          >
            {imGoing ? "I'm not going" : "I'm going!"}
          </Button>
        </Box>
      </Box>
      <EventComments event={event} readOnly={!!isPast} />
    </Paper>
  );
};

export default Event;
