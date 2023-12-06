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

export const create_flashcard = atom({
  key: "create flashcard",
  default: false,
});
