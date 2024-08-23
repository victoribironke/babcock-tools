import React from "react";

export type SidebarProps = {
  show: boolean;
  setShow: () => void;
};

export type DashboardTemplateProps = {
  children: React.ReactNode;
};

export type Event = {
  name: string;
  location: string;
  link: string;
  type: "physical" | "virtual";
  image: string;
  description: string;
  date_time: string;
  is_free: boolean;
  no_of_tickets: string;
  price_per_ticket: string;
  public: boolean;
  attendees: number;
  creator: string;
  id: string;
  subaccount_code: string;
  support_email: string;
  created_at: string;
  bank_code: string;
  account_number: string;
  account_name: string;
};
