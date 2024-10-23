import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinkType } from "./navLinks";

function DrawerLink({ link }: { link: NavLinkType }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <ListItem component={Link} href={link.href} sx={{ fontWeight: "inherit" }}>
      {link.icon && (
        <ListItemIcon sx={{ minWidth: 36 }}>
          <link.icon />
        </ListItemIcon>
      )}
      <ListItemText
        primary={link.title}
        primaryTypographyProps={{
          fontWeight: isActive(link.href) ? "700" : "400"
        }}
      />
    </ListItem>
  );
}

export default DrawerLink;
