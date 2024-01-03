import { IoTicketOutline, IoFastFoodOutline } from "react-icons/io5";
import { BsCardText } from "react-icons/bs";
import { PAGES } from "./pages";

export const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

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

export const TOOLS = [
  {
    title: "Cafeteria delivery",
    desc: "Have your cafeteria meal delivered to you.",
    icon: IoFastFoodOutline,
    link: PAGES.cafeteria_delivery,
    is_new: true,
  },
  {
    title: "Buy or sell meal tickets",
    desc: "Sell your meal ticket whenever you are unable to use it.",
    icon: IoTicketOutline,
    link: PAGES.meal_ticket,
    is_new: false,
  },
  {
    title: "Digital flashcards",
    desc: "Create digital flashcards to help you study efficiently.",
    icon: BsCardText,
    link: PAGES.digital_flashcards_dashboard,
    is_new: false,
  },
];
