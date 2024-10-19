import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

type NavLink = {
  title: string;
  href: string;
  icon?: React.ElementType;
};

export const navLinks: NavLink[] = [
  {
    title: "Home",
    href: "/",
    icon: HomeIcon
  },
  {
    title: "People",
    href: "/people",
    icon: PeopleIcon
  },
  {
    title: "Profile",
    href: "/profile",
    icon: AccountCircleIcon
  }
];
