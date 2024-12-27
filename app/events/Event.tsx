import {
  Box,
  Link as MuiLink,
  List,
  Paper,
  Typography,
  Button,
  Divider,
  Tooltip,
  Fab
} from "@mui/material";
import eventsState, { EventDocType } from "./Events.state";
import { formatFullBirthday, sendNotification } from "@/lib/clientUtils";
import appState from "@/lib/AppState";
import userList from "@/lib/UserList";
import UserListItem from "../people/UserListItem";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import EditEventModal from "./EditEventModal";
import EventComments from "./EventComments";

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
      {creator && (
        <Typography>
          Event created by{" "}
          <MuiLink component={Link} href={`/profile/${creator?.username}`}>
            {creator?.firstName} {creator?.lastName}
          </MuiLink>
        </Typography>
      )}

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
          {event.attendees.length === 0 ? (
            <Typography
              sx={{
                mb: 1
              }}
            >
              Nobody yet!
            </Typography>
          ) : (
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
                const user = userList.users.find(
                  (user) => user.id === attendee
                );
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
                      <Tooltip
                        title="I'm not going"
                        placement="top"
                        arrow
                        PopperProps={{
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -10]
                              }
                            }
                          ]
                        }}
                      >
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
          )}
          {!imGoing && (
            <Box
              sx={{
                // border: "2px solid red",
                display: "flex",
                justifyContent: {
                  xs: "center",
                  sm: "flex-start"
                }
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={updateAttendance}
                startIcon={<AddIcon />}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "170px"
                  },
                  maxWidth: 400
                }}
              >
                I&apos;m going!
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      <EventComments event={event} readOnly={!!isPast} />
    </Paper>
  );
};

export default Event;
