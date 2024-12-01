import { ListItem, ListItemText, ListItemIcon, Avatar } from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NavLinkType } from "./navLinks";
import { observer } from "mobx-react-lite";
import myProfileState from "@/app/profile/MyProfile.state";

const DrawerLink = observer(
  ({ link, parentLink }: { link: NavLinkType; parentLink?: NavLinkType }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isActive = (path: string) => {
      if (parentLink) {
        return (
          path.startsWith(pathname) &&
          searchParams.get(parentLink.paramKey!) === link.paramValue
        );
      } else return pathname === path;
    };

    return (
      <ListItem
        component={Link}
        href={link.href}
        sx={{
          backgroundColor: isActive(link.href) ? "primary.main" : "transparent",
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
            fontWeight: isActive(link.href) ? "700" : "400",
            color: "background.default"
          }}
        />
      </ListItem>
    );
  }
);

export default DrawerLink;
