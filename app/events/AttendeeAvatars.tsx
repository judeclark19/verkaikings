import {
  AvatarGroup,
  Avatar,
  Typography,
  Box,
  Link as MuiLink
} from "@mui/material";
import UserAvatar from "@/components/UserAvatar";
import { EventDocType } from "./Events.state";
import userList from "@/lib/UserList";
import { observer } from "mobx-react-lite";
import Tooltip from "@/components/Tooltip";
import Link from "next/link";

const MAX_DISPLAY = 5; // Limit the number of avatars displayed

const AttendeeAvatars = observer(({ event }: { event: EventDocType }) => {
  const attendees = event.attendees
    .map((attendeeId) => userList.users.find((user) => user.id === attendeeId))
    .filter((user) => user); // Remove any null/undefined users

  const visibleAttendees = attendees.slice(0, MAX_DISPLAY);
  const overflowAttendees = attendees.slice(MAX_DISPLAY);

  return (
    <AvatarGroup
      max={Infinity}
      sx={{
        justifyContent: "flex-end",
        mb: 2
      }}
    >
      {visibleAttendees.map((user) => (
        <UserAvatar user={user!} key={user!.id} />
      ))}
      {overflowAttendees.length > 0 && (
        <Tooltip
          title={
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {overflowAttendees.length} more attendees:
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {overflowAttendees.map((user) => (
                  <MuiLink
                    key={user!.id}
                    component={Link}
                    href={`/profile/${user?.username}`}
                    sx={{
                      fontSize: "0.875rem"
                    }}
                  >
                    {user?.firstName} {user?.lastName}
                  </MuiLink>
                ))}
              </Box>
            </Box>
          }
        >
          <Avatar>+{overflowAttendees.length}</Avatar>
        </Tooltip>
      )}
    </AvatarGroup>
  );
});

export default AttendeeAvatars;
