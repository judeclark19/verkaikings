import { UserDocType } from "@/lib/UserList";
import { Avatar, Typography } from "@mui/material";
import Link from "next/link";
import Tooltip from "./Tooltip";

function UserAvatar({ user }: { user: UserDocType }) {
  return (
    <Tooltip
      title={
        <Typography variant="body2" fontWeight="bold">
          {user.firstName} {user.lastName}
        </Typography>
      }
    >
      <Avatar
        src={user.profilePicture || ""}
        alt={`${user.firstName} ${user.lastName}`}
        sx={{ bgcolor: "secondary.main", fontSize: 16, textDecoration: "none" }}
        component={Link}
        href={`/profile/${user.username}`}
      >
        {!user.profilePicture &&
          `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
      </Avatar>
    </Tooltip>
  );
}

export default UserAvatar;
