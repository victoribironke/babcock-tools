import { atom } from "recoil";

export const getEmailModal = atom({
  key: "get email modal",
  default: {
    ticket_id: "",
  },
});
