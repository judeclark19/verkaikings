import {
  Typography,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { observer } from "mobx-react-lite";
import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

const NotificationListItem = observer(({ notif }: { notif: DocumentData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [markReadOnUnmount, setMarkReadOnUnmount] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);

    return () => {
      clearTimeout(timer);
      if (markReadOnUnmount) {
        notif.markAsRead();
      }
    };
  }, [markReadOnUnmount]);

  return (
    <ListItem
      key={notif.id}
      component={notif.url ? Link : "div"}
      href={notif.url}
      onClick={() => {
        if (!notif.read) {
          setMarkReadOnUnmount(true);
        }
      }}
      sx={{
        backgroundColor: notif.read ? "background.paper" : "primary.dark",
        borderRadius: "4px",
        marginBottom: "0.5rem",
        transition: "all 0.3s",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-100px)",
        "&:hover": {
          backgroundColor: notif.read ? "rgb(25,25,25)" : "primary.main"
        }
      }}
    >
      <ListItemText
        primary={
          <Typography
            display="block"
            component="span"
            sx={{
              transition: "color 0.3s",
              color: notif.read ? "text.secondary" : "#232323",
              fontWeight: notif.read ? "normal" : "bold"
            }}
          >
            {notif.title}
          </Typography>
        }
        secondary={
          <>
            <Typography
              display="block"
              component="span"
              sx={{
                transition: "color 0.3s",
                color: notif.read ? "text.secondary" : "#232323",
                fontWeight: notif.read ? "normal" : "bold"
              }}
            >
              {notif.body}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              component="span"
              sx={{
                transition: "color 0.3s",
                color: notif.read ? "text.secondary" : "#232323",
                mt: 0.5
              }}
            >
              {notif.createdAt.toDate().toLocaleString()}
            </Typography>
          </>
        }
      />
      <Tooltip
        title={notif.read ? "Mark as unread" : "Mark as read"}
        placement="top"
        arrow
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -14]
              }
            }
          ]
        }}
      >
        <Checkbox
          checked={!!notif.read}
          size="small"
          onClick={(e) => e.stopPropagation()}
          onChange={() => {
            setIsVisible(false);
            setTimeout(() => {
              notif.toggleRead();
            }, 300);
          }}
          sx={{
            transition: "color 0.3s",
            color: notif.read ? "white" : "#232323"
          }}
        />
      </Tooltip>
      <Tooltip
        title="Delete"
        placement="top"
        arrow
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -14]
              }
            }
          ]
        }}
      >
        <IconButton
          aria-label="delete"
          size="medium"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsVisible(false);
            setTimeout(() => {
              notif.delete();
            }, 300);
          }}
          sx={{
            transition: "color 0.3s",
            color: notif.read ? "white" : "#232323"
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
});

export default NotificationListItem;
