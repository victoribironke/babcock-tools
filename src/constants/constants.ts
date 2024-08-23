import { BsStars } from "react-icons/bs";
import { RiSettings3Fill } from "react-icons/ri";
import { GoHomeFill } from "react-icons/go";
import { IoFastFoodOutline } from "react-icons/io5";

export const IMAGES = {
  logo: { src: "/logo.jpeg", w: 128, h: 140 },
};

export const PAGES = {
  login: "/auth/login",
  signup: "/auth/signup",
  forgot_password: "/auth/forgot-password",

  dashboard: "/dashboard",
  dashboard_events: "/dashboard/events",
  cafeteria_delivery: "/dashboard/cafeteria-delivery",

  mailto: "mailto:hello@babcock.tools",
};

export const SIDEBAR_LINKS = [
  {
    title: "Dashboard",
    icon: GoHomeFill,
    link: PAGES.dashboard,
  },
  {
    title: "Events",
    icon: BsStars,
    link: PAGES.dashboard_events,
  },
  {
    title: "Cafeteria delivery",
    icon: IoFastFoodOutline,
    link: PAGES.cafeteria_delivery,
  },
];

export const HALLS_OF_RESIDENCE = [
  "Winslow",
  "Emerald",
  "Topaz",
  "Adeniji Adeleke",
  "Welch",
  "Nelson Mandela",
  "Gideon Troopers",
  "Samuel Akande",
  "Bethel Splendor",
  "Felicia Adebisi Dada",
  "Queen Esther",
  "Platinum",
  "Ameyo Adadevoh",
  "Justice Deborah",
  "Neal Wilson",
  "Havilah Gold",
  "Crystal",
  "Gamaliel",
  "White",
  "Nybergr",
  "Diamond",
  "Ogden",
  "Iperu",
].sort((a, b) => (a > b ? 1 : -1));
