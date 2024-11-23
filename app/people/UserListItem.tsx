import { checkIfBirthdayToday } from "@/lib/clientUtils";
import { ListItem, ListItemButton, ListItemText, Avatar } from "@mui/material";
import { getEmojiFlag } from "countries-list";
import { DocumentData } from "firebase-admin/firestore";
import Link from "next/link";

function UserListItem({ user }: { user: DocumentData }) {
  return (
    <ListItem
      key={user.id}
      disablePadding
      sx={{
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)"
        }
      }}
    >
      <ListItemButton
        component={Link}
        href={`/profile/${user.username}`}
        sx={{
          textDecoration: "none",
          color: "inherit",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        {/* Flag */}
        <span>{getEmojiFlag(user.countryAbbr.toUpperCase())}</span>

        {/* Avatar */}
        <Avatar
          src={user.profilePicture || ""}
          alt={`${user.firstName} ${user.lastName}`}
          sx={{ width: 24, height: 24, fontSize: 12, bgcolor: "primary.main" }}
        >
          {!user.profilePicture &&
            `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
        </Avatar>

        {/* Name and birthday cake */}
        <ListItemText
          primary={`${user.firstName} ${user.lastName}${
            checkIfBirthdayToday(user.birthday) ? " 🎂" : ""
          }`}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default UserListItem;
