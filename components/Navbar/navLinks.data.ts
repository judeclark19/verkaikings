import { ElementType } from "react";
import {
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  People as PeopleIcon,
  Cake as CakeIcon,
  Place as PlaceIcon,
  Map as MapIcon,
  MenuBook as MenuBookIcon,
  Event as EventIcon
} from "@mui/icons-material";

export type NavLinkType = {
  title: string;
  href: string;
  protected: boolean;
  paramKey?: string;
  paramValue?: string;
  icon?: ElementType;
  submenu?: NavLinkType[];
};

export const homeLink: NavLinkType = {
  title: "Home",
  href: "/",
  protected: false,
  icon: HomeIcon
};

export const myProfileLink: NavLinkType = {
  title: "My Profile",
  href: "/profile",
  protected: true,
  icon: AccountCircleIcon
};

export const peopleLinks: NavLinkType = {
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
    },
    {
      title: "Stories",
      href: "/people?viewBy=story",
      paramValue: "story",
      icon: MenuBookIcon,
      protected: true
    }
  ]
};

export const eventsLink: NavLinkType = {
  title: "Events",
  href: "/events",
  protected: true,
  icon: EventIcon
};
