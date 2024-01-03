export const PAGES = {
  home: "/",
  base_url: "https://babcock.tools",
  mailto: "mailto:hello@babcock.tools",

  meal_ticket: "/meal-ticket",
  how_does_the_meal_ticket_tool_work: "/meal-ticket/how-it-works",

  digital_flashcards: "/digital-flashcards",

  dashboard: "/dashboard",
  cafeteria_delivery: "/dashboard/cafeteria-delivery",
  register_as_a_deliverer: "/dashboard/cafeteria-delivery/register",
  sell_your_meal_ticket: "/dashboard/sell-your-meal-ticket",
  digital_flashcards_dashboard: "/dashboard/digital-flashcards",
  flashcards_for_course: (id: string) =>
    `/dashboard/digital-flashcards/${id.toLowerCase().split(" ").join("-")}`,

  login: "/auth/login",
  signup: "/auth/signup",
  forgot_password: "/auth/forgot-password",
};
