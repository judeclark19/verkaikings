import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NavLinkType } from "./navLinks";

function DrawerLink({
  link,
  parentLink
}: {
  link: NavLinkType;
  parentLink?: NavLinkType;
}) {
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
        backgroundColor: isActive(link.href) ? "primary.dark" : "transparent"
      }}
    >
      {link.icon && (
        <ListItemIcon
          sx={{
            color: "text.secondary"
          }}
        >
          <link.icon />
        </ListItemIcon>
      )}
      <ListItemText
        primary={link.title}
        primaryTypographyProps={{
          fontWeight: isActive(link.href) ? "700" : "400",
          color: "text.secondary"
        }}
      />
    </ListItem>
  );
}

export default DrawerLink;
