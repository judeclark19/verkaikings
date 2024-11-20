import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CakeIcon from "@mui/icons-material/Cake";
import PieChartIcon from "@mui/icons-material/PieChart";
import PlaceIcon from "@mui/icons-material/Place";
import MapIcon from "@mui/icons-material/Map";

export type NavLinkType = {
  title: string;
  href: string;
  protected: boolean;
  paramKey?: string;
  paramValue?: string;
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
    title: "Profile",
    href: "/profile",
    protected: true,
    icon: AccountCircleIcon
  },
  {
    title: "People",
    href: "/people",
    paramKey: "viewBy",
    protected: true,
    icon: PeopleIcon,
    submenu: [
      {
        title: "Names",
        href: "/people?viewBy=name",
        paramValue: "name",
        icon: PeopleIcon,
        protected: true
      },
      {
        title: "Birthdays",
        href: "/people?viewBy=birthday",
        paramValue: "birthday",
        icon: CakeIcon,
        protected: true
      },
      {
        title: "Locations",
        href: "/people?viewBy=location",
        paramValue: "location",
        icon: PlaceIcon,
        protected: true
      },
      {
        title: "Map",
        href: "/people?viewBy=map",
        paramValue: "map",
        icon: MapIcon,
        protected: true
      }
    ]
  }
];
