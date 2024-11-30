"use client";

import { Box, Divider, Fab, Paper, Typography } from "@mui/material";
import ProfilePic from "../profile/EditableFields/ProfilePic";
import EditIcon from "@mui/icons-material/Edit";
import ContactItem from "./ContactItem";
import { useEffect, useState } from "react";
import SandboxSkeleton from "./SandboxSkeleton";

function Sandbox() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) return <SandboxSkeleton />;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 3
      }}
      flexDirection={{
        xs: "column",
        md: "row"
      }}
    >
      {/* SIDEBAR */}
      <Box
        sx={{
          //   border: "1px solid red",
          maxWidth: "100%",
          flexShrink: 0
        }}
        width={{
          xs: "100%",
          md: "300px"
        }}
      >
        <ProfilePic />
        <br />
        <Typography
          variant="h1"
          display={{
            xs: "block",
            md: "none"
          }}
          sx={{
            textAlign: "center"
          }}
        >
          Jude Clark 🇺🇸🎂
        </Typography>
        <Paper
          elevation={3}
          sx={{
            padding: 3
          }}
        >
          <Typography variant="h3" sx={{ textAlign: "center", marginTop: 0 }}>
            Socials
          </Typography>
          <ContactItem initialValue="hello" />
          <ContactItem initialValue="hello" />
          <ContactItem initialValue="hello" />
          <ContactItem initialValue="hello" />
        </Paper>
      </Box>
      <Box
        sx={{
          flexGrow: 1
        }}
        maxWidth={{
          xs: "100%",
          md: "800px"
        }}
      >
        {/* FIRST SECTION - CONTACT DETAILS */}
        <Typography
          variant="h1"
          display={{
            xs: "none",
            md: "block"
          }}
        >
          Jude Clark 🇺🇸🎂
        </Typography>
        <Box
          sx={{
            display: "grid",
            columnGap: 2,
            rowGap: 0

            // gridTemplateColumns: "repeat(auto-fit, 300px)"
          }}
          gridTemplateColumns={{
            xs: "repeat(auto-fit, 100%)",
            sm: "repeat(auto-fit, 300px)"
          }}
          justifyContent={{
            xs: "center",
            md: "start"
          }}
        >
          <ContactItem initialValue="email" />
          <ContactItem initialValue="WA" />
          <ContactItem initialValue="birthday" />
          <ContactItem initialValue="pronouns" />
          <ContactItem initialValue="city" />
          <ContactItem initialValue="country" />
        </Box>

        <Divider />
        {/* SECOND SECTION - MY WILLEMIJN STORY */}
        <Box>
          <Typography variant="h2">My Willemijn Story</Typography>
          <Typography component="p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
            libero voluptate dignissimos minus. Quos, dolor quisquam possimus et
            vero illo illum aspernatur excepturi sapiente incidunt enim hic!
            Vitae ea inventore eligendi ut numquam nesciunt, veritatis quisquam
            velit tenetur laborum sed, voluptate repudiandae distinctio minima
            quo corporis possimus amet iure enim!
          </Typography>
          <Box
            sx={{
              marginTop: 1,
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <Fab
              size="medium"
              color="secondary"
              aria-label="edit"
              onClick={() => {
                //   setIsEditing(true);
              }}
            >
              <EditIcon />
            </Fab>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Sandbox;
