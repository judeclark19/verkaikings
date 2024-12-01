import UserListItem from "@/app/people/UserListItem";
import { formatBirthday2digit } from "@/lib/clientUtils";
import { Box, List, Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import React from "react";

function BirthdayCardList({
  users,
  emptyMessage
}: {
  users: DocumentData[];
  emptyMessage: string;
}) {
  return (
    <>
      {users.length === 0 && (
        <Typography
          sx={{
            color: "text.secondary"
          }}
        >
          {emptyMessage}
        </Typography>
      )}
      <List
        sx={{
          width: "fit-content",
          maxWidth: 360,
          margin: "auto",
          bgcolor: "background.paper"
        }}
      >
        {users.length > 0 &&
          users
            .sort(
              // Sort users alphabetically by username
              (a, b) => a.username.localeCompare(b.username)
            )
            .map((user) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center"
                }}
                key={user.username}
              >
                <UserListItem user={user} />
                <div
                  style={{
                    whiteSpace: "nowrap",
                    paddingRight: "1rem"
                  }}
                >
                  {" "}
                  - {formatBirthday2digit(user.birthday)}
                </div>
              </Box>
            ))}
      </List>
    </>
  );
}

export default BirthdayCardList;
