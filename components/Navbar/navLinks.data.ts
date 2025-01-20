import { ElementType } from "react";
import {
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  People as PeopleIcon,
  Cake as CakeIcon,
  Place as PlaceIcon,
  Map as MapIcon,
  MenuBook as MenuBookIcon,
  Event as EventIcon,
  Euro as EuroIcon,
  QuestionAnswer as QuestionAnswerIcon
} from "@mui/icons-material";

export type NavLinkType = {
  title: string;
  href: string;
  protected: boolean;
  paramKey?: string;
  paramValue?: string;
  params?: Record<string, string>;
  paramsOptional?: boolean;
  icon?: ElementType;
  submenu?: NavLinkType[];
};

export type NavLinkGroupType = {
  title: string;
  links: NavLinkType[];
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

export const peopleLinks: NavLinkGroupType = {
  title: "People",
  links: [
    {
      title: "Names",
      href: "/people",
      params: {
        viewBy: "name"
      },
      paramsOptional: true,
      icon: PeopleIcon,
      protected: true
    },
    {
      title: "Birthdays",
      href: "/people",
      params: {
        viewBy: "birthday"
      },
      icon: CakeIcon,
      protected: true
    },
    {
      title: "Locations",
      href: "/people",
      params: {
        viewBy: "location"
      },
      icon: PlaceIcon,
      protected: true
    },
    {
      title: "Map",
      href: "/people",
      params: {
        viewBy: "map"
      },
      icon: MapIcon,
      protected: true
    },
    {
      title: "Stories",
      href: "/people",
      params: {
        viewBy: "story"
      },
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

export const fundraisersLink: NavLinkType = {
  title: "Fundraisers",
  href: "/fundraisers",
  protected: true,
  icon: EuroIcon
};

export const qAndALink: NavLinkType = {
  title: "Q and A",
  href: "/qanda",
  protected: true,
  icon: QuestionAnswerIcon
};

export const moreLinks: NavLinkGroupType = {
  title: "More",
  links: [eventsLink, qAndALink]
};

// old, not in use
// export const peopleLinks: NavLinkType = {
//   title: "People",
//   href: "/people",
//   paramKey: "viewBy",
//   protected: true,
//   icon: PeopleIcon,
//   submenu: [
//     {
//       title: "Names",
//       href: "/people?viewBy=name",
//       paramValue: "name",
//       icon: PeopleIcon,
//       protected: true
//     },
//     {
//       title: "Birthdays",
//       href: "/people?viewBy=birthday",
//       paramValue: "birthday",
//       icon: CakeIcon,
//       protected: true
//     },
//     {
//       title: "Locations",
//       href: "/people?viewBy=location",
//       paramValue: "location",
//       icon: PlaceIcon,
//       protected: true
//     },
//     {
//       title: "Map",
//       href: "/people?viewBy=map",
//       paramValue: "map",
//       icon: MapIcon,
//       protected: true
//     },
//     {
//       title: "Stories",
//       href: "/people?viewBy=story",
//       paramValue: "story",
//       icon: MenuBookIcon,
//       protected: true
//     }
//   ]
// };
