import {
  Badge,
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
import {
  AppRegistration as AppRegistrationIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon
} from "@mui/icons-material";
import { styled } from "styled-components";
import notificationsState from "@/app/notifications/Notifications.state";

const ListStyle = styled(List)`
  a,
  .navLink {
    cursor: pointer;
    text-decoration: none;
    &:hover {
      /* text-decoration: underline; */
      background-color: "primary.main";
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
        Verkaikings Society
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
            else return <DrawerLink key={link.href} link={link} />;
          })}

        {/* link to Notifications */}
        {isLoggedIn && (
          <ListItem
            component={Link}
            href="/notifications"
            sx={{
              backgroundColor: isActive("/notifications")
                ? "primary.main"
                : "transparent",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "primary.main"
              }
            }}
          >
            <ListItemIcon
              sx={{
                color: "background.default",
                minWidth: "40px"
              }}
            >
              {notificationsState.notifications.filter((notif) => !notif.read)
                .length > 0 ? (
                <Badge
                  badgeContent={notificationsState.unreadNotifications.length}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      right: 4,
                      top: 4,
                      backgroundColor: "secondary.dark",
                      color: "white"
                    }
                  }}
                >
                  <NotificationsActiveIcon sx={{ fontSize: 24 }} />
                </Badge>
              ) : (
                <NotificationsIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary="NOTIFICATIONS"
              primaryTypographyProps={{
                fontWeight: isActive("/notifications") ? "700" : "400",
                color: "background.default"
              }}
            />
          </ListItem>
        )}

        {/* link to /login */}
        <ListItem
          onClick={isLoggedIn ? handleLogout : () => router.push("/login")}
          sx={{
            fontWeight: "inherit",
            backgroundColor: isActive("/login")
              ? "primary.main"
              : "transparent",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "primary.main"
            }
          }}
          className="navLink"
        >
          <ListItemIcon
            sx={{
              color: "background.default",
              minWidth: "40px"
            }}
          >
            {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
          </ListItemIcon>

          <ListItemText
            primary={isLoggedIn ? "LOG OUT" : "LOG IN"}
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
                color: "background.default",
                minWidth: "40px"
              }}
            >
              <AppRegistrationIcon />
            </ListItemIcon>

            <ListItemText
              primary="SIGN UP"
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
