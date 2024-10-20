import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

type NavLink = {
  title: string;
  href: string;
  protected: boolean;
  icon?: React.ElementType;
};

export const navLinks: NavLink[] = [
  {
    title: "Home",
    href: "/",
    protected: false,
    icon: HomeIcon
  },
  {
    title: "People",
    href: "/people",
    protected: true,
    icon: PeopleIcon
  },
  {
    title: "Profile",
    href: "/profile",
    protected: true,
    icon: AccountCircleIcon
  }
];
