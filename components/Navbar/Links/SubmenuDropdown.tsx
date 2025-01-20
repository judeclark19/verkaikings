import { Button, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NavLinkGroupType } from "../navLinks.data";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, MouseEvent } from "react";
import { createNavLinkPathString, isNavLinkActive } from "@/lib/clientUtils";

export default function SubmenuDropdown({
  linkGroup
}: {
  linkGroup: NavLinkGroupType;
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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center"
      }}
    >
      <Button
        id="submenu-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
        sx={{
          fontWeight: linkGroup.links.some((link) => {
            return isNavLinkActive(pathname, searchParams, link);
          })
            ? "700"
            : "400",
          display: "flex",
          alignItems: "center",
          height: "100%",
          backgroundColor: linkGroup.links.some((link) => {
            return isNavLinkActive(pathname, searchParams, link);
          })
            ? "primary.main"
            : "transparent",

          "&:hover": {
            backgroundColor: "primary.main"
          },

          "&[aria-expanded='true']": {
            backgroundColor: "primary.main"
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
        {linkGroup.title}
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
            backgroundColor: "primary.dark",
            color: "text.primary"
          },
          "& .MuiMenu-list": {
            backgroundColor: "primary.dark"
          }
        }}
      >
        {linkGroup.links.map((link) => {
          return (
            <MenuItem
              key={link.title}
              onClick={handleClose}
              component={Link}
              href={createNavLinkPathString(link)}
              sx={{
                fontWeight: isNavLinkActive(pathname, searchParams, link)
                  ? "700"
                  : "400",
                textDecoration: isNavLinkActive(pathname, searchParams, link)
                  ? "underline"
                  : "none",
                fontSize: "14px",
                transition: "background-color 0.3s ease",
                backgroundColor: isNavLinkActive(pathname, searchParams, link)
                  ? "primary.main"
                  : "primary.dark",
                color: "background.default",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "primary.main"
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
