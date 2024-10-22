import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";

export default function SubmenuDropdown() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="submenu-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="inherit"
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
        <MenuItem onClick={handleClose} component={Link} href="/people">
          People List
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={Link}
          href="/people/birthdays"
        >
          Birthdays
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={Link}
          href="/people/demographics"
        >
          Demographics
        </MenuItem>
      </Menu>
    </div>
  );
}
