export const PAGES = {
  home: "/",
  base_url: "https://babcock.tools",
  mailto: "mailto:babcock.tools@gmail.com",

  meal_ticket: "/meal-ticket",
  how_does_the_meal_ticket_tool_work: "/meal-ticket/how-it-works",

  cafeteria_delivery_instructions: "/cafeteria-delivery/how-it-works",

  dashboard: "/dashboard",
  account_profile: "/dashboard/profile",
  admin: "/dashboard/admin",
  cafeteria_delivery: "/dashboard/cafeteria-delivery",
  register_as_a_deliverer: "/dashboard/cafeteria-delivery/register",
  deliverer_profile: "/dashboard/cafeteria-delivery/deliverer-profile",
  sell_your_meal_ticket: "/dashboard/sell-your-meal-ticket",
  digital_flashcards_dashboard: "/dashboard/digital-flashcards",
  flashcards_for_course: (id: string) =>
    `/dashboard/digital-flashcards/${id.toLowerCase().split(" ").join("-")}`,

  login: "/auth/login",
  signup: "/auth/signup",
  forgot_password: "/auth/forgot-password",
};
