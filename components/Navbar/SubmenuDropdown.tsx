import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinkType } from "./navLinks";

export default function SubmenuDropdown({
  parentLink
}: {
  parentLink: NavLinkType;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pathname = usePathname();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div>
      <Button
        id="submenu-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        sx={{
          fontWeight: isActive(parentLink.href) ? "700" : "400",
          textDecoration: isActive(parentLink.href) ? "underline" : "none"
        }}
      >
        People
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "submenu-button"
        }}
      >
        {parentLink.submenu!.map((link) => (
          <MenuItem
            key={link.href}
            onClick={handleClose}
            component={Link}
            href={link.href}
            sx={{
              fontWeight: isActive(link.href) ? "700" : "400",
              textDecoration: isActive(link.href) ? "underline" : "none"
            }}
          >
            {link.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
