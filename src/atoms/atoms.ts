import { FullFlashcard, SummarizedCard } from "@/types/dashboard";
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

export const create_flashcard = atom<SummarizedCard[] | null>({
  key: "create flashcard",
  default: null,
});

export const edit_flashcard = atom<FullFlashcard | null>({
  key: "edit flashcard",
  default: null,
});

export const delete_flashcard = atom<FullFlashcard | null>({
  key: "delete flashcard",
  default: null,
});

export const start_practice = atom({
  key: "start practice",
  default: "",
});

export const create_new_flashcard = atom({
  key: "create new flashcard",
  default: false,
});

export const flashcards_for_practice = atom<FullFlashcard[]>({
  key: "flashcards for practice",
  default: [],
});

export const edit_order_status = atom({
  key: "edit order status",
  default: "",
});

export const deactivate_deliverer_profile = atom({
  key: "deactivate deliverer profile",
  default: "",
});
