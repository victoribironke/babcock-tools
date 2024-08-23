import { BsStars } from "react-icons/bs";
import { RiSettings3Fill } from "react-icons/ri";
import { GoHomeFill } from "react-icons/go";
import { IoFastFoodOutline } from "react-icons/io5";
import { Event } from "@/types/dashboard";

export const IMAGES = {
  logo: { src: "/logo.jpeg", w: 128, h: 140 },
};

export const PAGES = {
  base_url: "https://babcock.tools/",

  login: "/auth/login",
  signup: "/auth/signup",
  forgot_password: "/auth/forgot-password",

  dashboard: "/dashboard",
  dashboard_events: "/dashboard/events",
  cafeteria_delivery: "/dashboard/cafeteria-delivery",

  events: "/events",
  event: (id: string) => `/event/${id}`,
  dashboard_event: (id: string) => `dashboard/events/${id}`,

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

export const INITIAL_STATE: Event = {
  name: "",
  location: "",
  link: "",
  type: "physical", // physical or virtual
  image: "",
  description: "",
  date_time: "",
  is_free: true,
  no_of_tickets: "",
  price_per_ticket: "",
  public: false,
  support_email: "",
  attendees: 0,
  creator: "",
  id: "",
  subaccount_code: "",
  created_at: "",
  bank_code: "",
  account_number: "",
  account_name: "",
};

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

export const BANKS = [
  {
    name: "Access Bank",
    slug: "access-bank",
    code: "044",
  },
  {
    name: "Access Bank (Diamond)",
    slug: "access-bank-diamond",
    code: "063",
  },
  {
    name: "ALAT by WEMA",
    slug: "alat-by-wema",
    code: "035A",
  },
  {
    name: "ASO Savings and Loans",
    slug: "asosavings",
    code: "401",
  },
  {
    name: "Bowen Microfinance Bank",
    slug: "bowen-microfinance-bank",
    code: "50931",
  },
  {
    name: "CEMCS Microfinance Bank",
    slug: "cemcs-microfinance-bank",
    code: "50823",
  },
  {
    name: "Citibank Nigeria",
    slug: "citibank-nigeria",
    code: "023",
  },
  {
    name: "Ecobank Nigeria",
    slug: "ecobank-nigeria",
    code: "050",
  },
  {
    name: "Ekondo Microfinance Bank",
    slug: "ekondo-microfinance-bank",
    code: "562",
  },
  {
    name: "Fidelity Bank",
    slug: "fidelity-bank",
    code: "070",
  },
  {
    name: "First Bank of Nigeria",
    slug: "first-bank-of-nigeria",
    code: "011",
  },
  {
    name: "First City Monument Bank",
    slug: "first-city-monument-bank",
    code: "214",
  },
  {
    name: "Globus Bank",
    slug: "globus-bank",
    code: "00103",
  },
  {
    name: "Guaranty Trust Bank",
    slug: "guaranty-trust-bank",
    code: "058",
  },
  {
    name: "Hasal Microfinance Bank",
    slug: "hasal-microfinance-bank",
    code: "50383",
  },
  {
    name: "Heritage Bank",
    slug: "heritage-bank",
    code: "030",
  },
  {
    name: "Jaiz Bank",
    slug: "jaiz-bank",
    code: "301",
  },
  {
    name: "Keystone Bank",
    slug: "keystone-bank",
    code: "082",
  },
  {
    name: "Kuda Bank",
    slug: "kuda-bank",
    code: "50211",
  },
  {
    name: "Moniepoint MFB",
    slug: "moniepoint-mfb-ng",
    code: "50515",
  },
  {
    name: "One Finance",
    slug: "one-finance",
    code: "565",
  },
  {
    name: "OPay Digital Services Limited (OPay)",
    slug: "paycom",
    code: "999992",
  },
  {
    name: "Paga",
    slug: "paga",
    code: "327",
  },
  {
    name: "PalmPay",
    slug: "palmpay",
    code: "999991",
  },
  {
    name: "Parallex Bank",
    slug: "parallex-bank",
    code: "526",
  },
  {
    name: "PayCom",
    slug: "paycom",
    code: "100004",
  },
  {
    name: "Polaris Bank",
    slug: "polaris-bank",
    code: "076",
  },
  {
    name: "Providus Bank",
    slug: "providus-bank",
    code: "101",
  },
  {
    name: "Rubies MFB",
    slug: "rubies-mfb",
    code: "125",
  },
  {
    name: "Sparkle Microfinance Bank",
    slug: "sparkle-microfinance-bank",
    code: "51310",
  },
  {
    name: "Stanbic IBTC Bank",
    slug: "stanbic-ibtc-bank",
    code: "221",
  },
  {
    name: "Standard Chartered Bank",
    slug: "standard-chartered-bank",
    code: "068",
  },
  {
    name: "Sterling Bank",
    slug: "sterling-bank",
    code: "232",
  },
  {
    name: "Suntrust Bank",
    slug: "suntrust-bank",
    code: "100",
  },
  {
    name: "TAJ Bank",
    slug: "taj-bank",
    code: "302",
  },
  {
    name: "TCF MFB",
    slug: "tcf-mfb",
    code: "51211",
  },
  {
    name: "Titan Trust Bank",
    slug: "titan-trust-bank",
    code: "102",
  },
  {
    name: "Union Bank of Nigeria",
    slug: "union-bank-of-nigeria",
    code: "032",
  },
  {
    name: "United Bank For Africa",
    slug: "united-bank-for-africa",
    code: "033",
  },
  {
    name: "Unity Bank",
    slug: "unity-bank",
    code: "215",
  },
  {
    name: "VFD",
    slug: "vfd",
    code: "566",
  },
  {
    name: "Wema Bank",
    slug: "wema-bank",
    code: "035",
  },
  {
    name: "Zenith Bank",
    slug: "zenith-bank",
    code: "057",
  },
];
