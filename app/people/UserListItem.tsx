import { checkIfBirthdayToday } from "@/lib/clientUtils";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { getEmojiFlag } from "countries-list";
import { DocumentData } from "firebase-admin/firestore";
import Link from "next/link";

function UserListItem({ user }: { user: DocumentData }) {
  const getText = () => {
    let text = `${getEmojiFlag(user.countryAbbr.toUpperCase())} ${
      user.firstName
    } ${user.lastName}`;

    if (checkIfBirthdayToday(user.birthday)) {
      text += " 🎂";
    }

    return text;
  };

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
          width: "100%"
        }}
      >
        <ListItemText primary={getText()} />
      </ListItemButton>
    </ListItem>
  );
}

export default UserListItem;
