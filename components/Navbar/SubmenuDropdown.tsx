import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NavLinkType } from "./navLinks";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, MouseEvent } from "react";

export default function SubmenuDropdown({
  parentLink
}: {
  parentLink: NavLinkType;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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
          display: "flex",
          alignItems: "center",
          backgroundColor: isActive(parentLink.href)
            ? "primary.main"
            : "transparent",

          "&:hover": {
            textDecoration: "underline"
          }
        }}
        endIcon={
          <ArrowDropDownIcon
            sx={{
              transition: "transform 0.3s ease",
              transform: open ? "rotate(180deg)" : "rotate(360deg)"
            }}
          />
        }
      >
        People
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "submenu-button",
          role: "menu"
        }}
        sx={{
          "& .MuiMenu-paper": {
            backgroundColor: "primary.main",
            color: "text.primary"
          },
          "& .MuiMenu-list": {
            backgroundColor: "primary.main"
          }
        }}
      >
        {parentLink.submenu!.map((link) => {
          return (
            <MenuItem
              key={link.href}
              onClick={handleClose}
              component={Link}
              href={link.href}
              sx={{
                fontWeight: isActive(link.href) ? "700" : "400",
                textDecoration: isActive(link.href) ? "underline" : "none",
                fontSize: "14px",
                backgroundColor:
                  isActive(parentLink.href) &&
                  searchParams.get(parentLink.paramKey!) === link.paramValue
                    ? "primary.dark"
                    : "primary.main",
                color: "background.default",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "primary.dark"
                },
                padding: "0.75rem 1.5rem"
              }}
            >
              {link.title.toUpperCase()}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
