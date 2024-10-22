import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CakeIcon from "@mui/icons-material/Cake";
import PieChartIcon from "@mui/icons-material/PieChart";

export type NavLinkType = {
  title: string;
  href: string;
  protected: boolean;
  icon?: React.ElementType;
  submenu?: NavLinkType[];
};

export const navLinks: NavLinkType[] = [
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
    icon: PeopleIcon,
    submenu: [
      {
        title: "List",
        href: "/people",
        icon: PeopleIcon,
        protected: true
      },
      {
        title: "Birthdays",
        href: "/people/birthdays",
        icon: CakeIcon,
        protected: true
      },
      {
        title: "Demographics",
        href: "/people/demographics",
        icon: PieChartIcon,
        protected: true
      }
    ]
  },
  {
    title: "Profile",
    href: "/profile",
    protected: true,
    icon: AccountCircleIcon
  }
];
