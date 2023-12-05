import { atom } from "recoil";

export const get_ticket_details = atom({
  key: "get ticket details",
  default: {
    ticket_id: "",
  },
});

export const get_help = atom({
  key: "get help",
  default: false,
});
