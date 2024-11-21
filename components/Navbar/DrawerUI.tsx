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
      <Typography variant="h3" sx={{ my: 2, ml: 2 }}>
        Willemijn&apos;s World
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
              color: "background.default"
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
              color: "background.default",
              backgroundColor: isActive("/signup")
                ? "primary.dark"
                : "transparent"
            }}
          >
            <ListItemIcon
              sx={{
                color: "background.default"
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
