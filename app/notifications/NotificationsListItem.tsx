import {
  Typography,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Tooltip,
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { observer } from "mobx-react-lite";
import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowForward } from "@mui/icons-material";

const NotificationListItem = observer(
  ({
    notif,
    visibility,
    setVisibility
  }: {
    notif: DocumentData;
    visibility: { [key: string]: boolean };
    setVisibility: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >;
  }) => {
    const [markReadOnUnmount, setMarkReadOnUnmount] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setVisibility((prev) => ({ ...prev, [notif.id]: true }));
      }, 10);

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
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row"
          },
          gap: {
            xs: 0,
            sm: 1
          },
          backgroundColor: notif.read ? "background.paper" : "primary.dark",
          borderRadius: "4px",
          marginBottom: "0.5rem",
          transition: "all 0.3s",
          opacity:
            visibility[notif.id] || visibility[notif.id] === undefined ? 1 : 0,
          transform:
            visibility[notif.id] || visibility[notif.id] === undefined
              ? "translateX(0)"
              : "translateX(-100px)",
          "&:hover": {
            backgroundColor: notif.read ? "rgb(25,25,25)" : "var(--med-pink)"
          }
        }}
      >
        <ListItemText
          sx={{
            width: {
              xs: "100%",
              sm: "auto"
            }
          }}
          primary={
            <Typography
              display="block"
              variant="h4"
              sx={{
                m: 0,
                fontSize: "1.3rem",
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
                  color: notif.read ? "text.secondary" : "#232323"
                }}
              >
                {notif.createdAt.toDate().toLocaleString()}
              </Typography>
            </>
          }
        />
        <Box
          sx={{
            display: "flex",
            width: {
              xs: "100%",
              sm: "auto"
            },
            justifyContent: "flex-end"
          }}
        >
          <Tooltip
            title="Delete"
            placement="top"
            arrow
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -12]
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
                setVisibility((prev) => ({ ...prev, [notif.id]: false }));
                setTimeout(() => {
                  notif.delete();
                }, 300);
              }}
              sx={{
                transition: "color 0.3s",
                color: notif.read ? "white" : "#232323",
                width: "50px"
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={notif.read ? "Mark as unread" : "Mark as read"}
            placement="top"
            arrow
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -12]
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
                setVisibility((prev) => ({ ...prev, [notif.id]: false }));
                setTimeout(() => {
                  notif.toggleRead();
                }, 300);
              }}
              sx={{
                transition: "color 0.3s",
                color: notif.read ? "white" : "#232323",
                width: "50px"
              }}
            />
          </Tooltip>
          {notif.url && (
            <Tooltip
              title="Go to source"
              placement="top"
              arrow
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -12]
                    }
                  }
                ]
              }}
            >
              <IconButton
                aria-label="go"
                size="medium"
                onClick={() => {
                  if (!notif.read) {
                    setMarkReadOnUnmount(true);
                  }
                }}
                LinkComponent={Link}
                href={notif.url}
                sx={{
                  transition: "color 0.3s",
                  color: notif.read ? "white" : "#232323"
                }}
              >
                <ArrowForward fontSize="large" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </ListItem>
    );
  }
);

export default NotificationListItem;
