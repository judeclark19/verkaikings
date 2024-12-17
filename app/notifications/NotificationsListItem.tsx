import {
  Typography,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { observer } from "mobx-react-lite";
import { DocumentData } from "firebase/firestore";
import Link from "next/link";

const NotificationListItem = observer(({ notif }: { notif: DocumentData }) => {
  return (
    <ListItem
      key={notif.id}
      sx={{
        backgroundColor: notif.read ? "background.default" : "primary.dark",
        borderRadius: "4px",
        marginBottom: "0.5rem",
        transition: "background-color 0.3s"
      }}
    >
      <ListItemText
        primary={
          notif.url ? (
            <Link
              href={notif.url}
              style={{
                textDecoration: "underline",
                color: "inherit"
              }}
            >
              {notif.title}
            </Link>
          ) : (
            notif.title
          )
        }
        secondary={
          <>
            {notif.body}
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              {notif.createdAt.toDate().toLocaleString()}
            </Typography>
          </>
        }
      />
      <Checkbox
        checked={!!notif.read}
        onChange={() => {
          notif.toggleRead();
        }}
      />
      <IconButton
        aria-label="delete"
        size="small"
        onClick={() => notif.delete()}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </ListItem>
  );
});

export default NotificationListItem;
