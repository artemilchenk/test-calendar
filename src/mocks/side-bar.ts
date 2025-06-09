import type { ISideBarItem } from "../types/side-bar.ts";
import homeIcon from "../assets/icons/sidebar/home.svg";
import inboxIcon from "../assets/icons/sidebar/inbox.svg";
import invoicesIcon from "../assets/icons/sidebar/invoices.svg";
import supportIcon from "../assets/icons/sidebar/support.svg";
import calendarIcon from "../assets/icons/sidebar/calendar.svg";
import settingsIcon from "../assets/icons/sidebar/settings.svg";

export const sideBarItems: ISideBarItem[] = [
  {
    id: "1",
    icon: homeIcon,
    title: "Home",
  },
  {
    id: "2",
    icon: inboxIcon,
    title: "Dashboard",
  },
  {
    id: "3",
    icon: inboxIcon,
    title: "Inbox",
  },
  {
    id: "4",
    icon: invoicesIcon,
    title: "Products",
  },
  {
    id: "5",
    icon: invoicesIcon,
    title: "Invoices",
  },
  {
    id: "6",
    icon: supportIcon,
    title: "Customers",
  },
  {
    id: "7",
    icon: supportIcon,
    title: "Chat Room",
  },
  {
    id: "8",
    icon: calendarIcon,
    title: "Calendar",
    isActive: true,
  },
  {
    id: "9",
    icon: supportIcon,
    title: "Help Center",
  },
  {
    id: "10",
    icon: settingsIcon,
    title: "Settings",
  },
];
