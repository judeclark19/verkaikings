import {
  Box,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { navLinks } from "./navLinks";
import DrawerLink from "./DrawerLink";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppRegistration } from "@mui/icons-material";
import { styled } from "styled-components";

const ListStyle = styled(List)`
  a,
  .navLink {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const VerticalLine = styled("li")`
  position: relative;

  a {
    padding-left: 0;
  }

  &::before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 2px;
    height: 100%;
    background-color: #232323;
    margin-right: 8px;
    left: -24px;
  }
`;

function DrawerUI({
  isLoggedIn,
  handleDrawerToggle,
  handleLogout
}: {
  isLoggedIn: boolean;
  handleDrawerToggle: () => void;
  handleLogout: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = (path: string) => pathname === path;

  return (
    <Box onClick={handleDrawerToggle}>
      <Typography variant="h4" sx={{ my: 2, ml: 2 }}>
        Willemijn's World Website
      </Typography>
      <ListStyle>
        {navLinks
          .filter((link) => {
            if (link.protected) {
              return isLoggedIn;
            }
            return true;
          })
          .map((link) => {
            if (link.submenu)
              return (
                <div
                  key={link.title}
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
                        marginLeft: "3px",
                        padding: "8px 16px",
                        color: "text.secondary"
                      }}
                    >
                      {link.title}
                    </Typography>
                  </Box>
                  <Box
                    component="ul"
                    sx={{
                      padding: 0,
                      margin: 0,
                      listStyle: "none",
                      position: "relative"
                    }}
                  >
                    {/* Vertical Line */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: "-24px",
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        backgroundColor: "#232323"
                      }}
                    />
                    {link.submenu.map((submenuLink) => (
                      <Box
                        component="li"
                        key={submenuLink.href}
                        sx={{
                          position: "relative",
                          marginBottom: "8px",
                          fontWeight: "700",
                          backgroundColor:
                            isActive(link.href) &&
                            searchParams.get(link.paramKey!) ===
                              submenuLink.paramValue
                              ? "primary.dark"
                              : "transparent"
                        }}
                      >
                        <DrawerLink link={submenuLink} parentLink={link} />
                      </Box>
                    ))}
                  </Box>
                </div>
              );
            else return <DrawerLink key={link.href} link={link} />;
          })}

        {/* link to /login */}
        <ListItem
          onClick={isLoggedIn ? handleLogout : () => router.push("/login")}
          sx={{
            fontWeight: "inherit",
            backgroundColor: isActive("/login") ? "primary.dark" : "transparent"
          }}
          className="navLink"
        >
          <ListItemIcon
            sx={{
              color: "text.secondary"
            }}
          >
            {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
          </ListItemIcon>

          <ListItemText
            primary={isLoggedIn ? "Log Out" : "Log In"}
            primaryTypographyProps={{
              fontWeight: isActive("/login") ? "700" : "400"
            }}
          />
        </ListItem>

        {/* link to /signup */}

        {!isLoggedIn && (
          <ListItem
            component={Link}
            href="/signup"
            sx={{
              fontWeight: "inherit",
              color: "text.secondary",
              backgroundColor: isActive("/signup")
                ? "primary.dark"
                : "transparent"
            }}
          >
            <ListItemIcon
              sx={{
                color: "text.secondary"
              }}
            >
              <AppRegistration />
            </ListItemIcon>

            <ListItemText
              primary="Sign Up"
              primaryTypographyProps={{
                fontWeight: isActive("/signup") ? "700" : "400"
              }}
            />
          </ListItem>
        )}
      </ListStyle>
    </Box>
  );
}

export default DrawerUI;
