import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { NavLinkType } from "../navLinks.data";
import DrawerLink from "./DrawerLink";

// OLD COMPONENT, not in use just keeping for reference

const DrawerLinkWithSubmenu = ({
  link,
  isActive,
  searchParams
}: {
  link: NavLinkType;
  isActive: boolean;
  searchParams: URLSearchParams;
}) => {
  return (
    <div
      style={{
        paddingLeft: "52px"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          marginBottom: "8px"
        }}
      >
        <Box
          //circle
          component="span"
          sx={{
            position: "absolute",
            left: "-30px",
            width: "12px",
            height: "12px",
            border: "2px solid #232323",
            borderRadius: "50%"
          }}
        />
        <Typography
          component={Link}
          href={link.href}
          sx={{
            padding: "8px 16px 8px 4px",
            color: "background.default"
          }}
        >
          {link.title.toUpperCase()}
        </Typography>
      </Box>
      <Box
        component="ul"
        sx={{
          padding: 0,
          margin: 0,
          marginLeft: "-15px",
          listStyle: "none",
          position: "relative"
        }}
      >
        {/* Vertical Line */}
        <Box
          sx={{
            position: "absolute",
            left: "-11px",
            top: 0,
            bottom: 0,
            width: "2px",
            backgroundColor: "#232323"
          }}
        />
        {link.submenu!.map((submenuLink) => (
          <Box
            component="li"
            key={submenuLink.href}
            sx={{
              position: "relative",
              marginBottom: "8px",
              fontWeight: "700",
              backgroundColor:
                isActive &&
                searchParams.get(link.paramKey!) === submenuLink.paramValue
                  ? "primary.main"
                  : "transparent"
            }}
          >
            <DrawerLink link={submenuLink} parentLink={link} />
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default DrawerLinkWithSubmenu;
