import { ListItem, ListItemText, ListItemIcon, Avatar } from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NavLinkType } from "../navLinks.data";
import { observer } from "mobx-react-lite";
import myProfileState from "@/app/profile/MyProfile.state";
import { createNavLinkPathString, isNavLinkActive } from "@/lib/clientUtils";

const DrawerLink = observer(({ link }: { link: NavLinkType }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <ListItem
      component={Link}
      href={createNavLinkPathString(link)}
      sx={{
        backgroundColor: isNavLinkActive(pathname, searchParams, link)
          ? "primary.main"
          : "transparent",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: "primary.main"
        }
      }}
    >
      <ListItemIcon
        sx={{
          color: "background.default",
          minWidth: "40px"
        }}
      >
        {link.icon && link.title !== "My Profile" && <link.icon />}
        {link.title === "My Profile" && myProfileState.user && (
          <Avatar
            src={myProfileState.user.profilePicture || ""}
            alt={`${myProfileState.user.firstName} ${myProfileState.user.lastName}`}
            sx={{
              width: 24,
              height: 24,
              fontSize: 12,
              bgcolor: "secondary.main"
            }}
          >
            {!myProfileState.user.profilePicture &&
              `${myProfileState.user.firstName?.[0] || ""}${
                myProfileState.user.lastName?.[0] || ""
              }`}
          </Avatar>
        )}
      </ListItemIcon>

      <ListItemText
        primary={link.title.toUpperCase()}
        primaryTypographyProps={{
          fontWeight: isNavLinkActive(pathname, searchParams, link)
            ? "700"
            : "400",
          color: "background.default"
        }}
      />
    </ListItem>
  );
});

export default DrawerLink;
