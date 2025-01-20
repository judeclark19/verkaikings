import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography
} from "@mui/material";
// import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { NavLinkGroupType } from "../navLinks.data";
import DrawerLink from "./DrawerLink";
import { usePathname, useSearchParams } from "next/navigation";
// import { useState } from "react";
import { isNavLinkActive } from "@/lib/clientUtils";

const DrawerAccordion = ({ linkGroup }: { linkGroup: NavLinkGroupType }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // const [expanded, setExpanded] = useState(false);

  if (!pathname) return null;

  return (
    <Accordion
      disableGutters
      sx={{
        backgroundColor: "transparent",

        color: "background.default",
        border: "none",
        margin: "0",
        "&::before": {
          display: "none"
        },

        "&.MuiPaper-root": {
          boxShadow: "none",
          backgroundImage: "none"
        }
      }}
      expanded={true}
      // onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        // expandIcon={<ExpandMoreIcon sx={{ color: "background.default" }} />}
        aria-controls={`linkgroup-${linkGroup.title}-content`}
        id={`linkgroup-${linkGroup.title}-header`}
        onClick={(event) => {
          event.stopPropagation();
        }}
        sx={{
          backgroundColor:
            // !expanded &&
            linkGroup.links!.some((link) =>
              isNavLinkActive(pathname, searchParams, link)
            )
              ? "primary.main"
              : "transparent",
          transition: "background-color 0.3s ease",
          cursor: "auto",
          pointerEvents: "none"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative"
          }}
        >
          <Box
            //circle
            component="span"
            sx={{
              position: "absolute",
              left: "5px",
              width: "12px",
              height: "12px",
              border: "2px solid #232323",
              borderRadius: "50%"
            }}
          />
          <Typography
            component="span"
            sx={{
              paddingLeft: "40px"
            }}
          >
            {linkGroup.title.toUpperCase()}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: 0,
          marginLeft: "53px"
        }}
      >
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
          {linkGroup.links!.map((submenuLink) => (
            <Box
              component="li"
              key={submenuLink.title}
              sx={{
                position: "relative",
                marginBottom: "8px",
                fontWeight: "700",
                backgroundColor: isNavLinkActive(
                  pathname,
                  searchParams,
                  submenuLink
                )
                  ? "primary.main"
                  : "transparent"
              }}
            >
              <DrawerLink link={submenuLink} />
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default DrawerAccordion;
