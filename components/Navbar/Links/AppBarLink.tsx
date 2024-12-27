import { NavLinkType } from "../navLinks.data";
import { Avatar, Button, CircularProgress, Divider } from "@mui/material";
import Link from "next/link";
import myProfileState from "@/app/profile/MyProfile.state";
import { observer } from "mobx-react-lite";

const AppBarLink = observer(
  ({ link, isActive }: { link: NavLinkType; isActive: boolean }) => {
    return (
      <>
        <Button
          color="inherit"
          component={Link}
          href={link.href}
          sx={{
            fontWeight: isActive ? "700" : "500",
            backgroundColor: isActive ? "primary.main" : "transparent",
            "&:hover": {
              backgroundColor: "primary.main"
            }
          }}
        >
          {link.title === "My Profile" && myProfileState.user ? (
            <>
              <Avatar
                src={myProfileState.user.profilePicture || ""}
                alt={`${myProfileState.user.firstName} ${myProfileState.user.lastName}`}
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: 12,
                  bgcolor: "secondary.main"
                }}
              >
                {!myProfileState.user.profilePicture &&
                  `${myProfileState.user.firstName?.[0] || ""}${
                    myProfileState.user.lastName?.[0] || ""
                  }`}
              </Avatar>
            </>
          ) : link.title === "My Profile" ? (
            <CircularProgress
              size={24}
              sx={{
                color: "inherit"
              }}
            />
          ) : (
            link.title
          )}
        </Button>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "background.default",
            margin: "0 8px"
          }}
        />
      </>
    );
  }
);

export default AppBarLink;
