import React from "react";

export type SidebarProps = {
  show: boolean;
  setShow: () => void;
};

export type DashboardTemplateProps = {
  children: React.ReactNode;
};

export type ATicket = {
  meal_type: string;
  ticket_date: string;
  price: string;
  sold?: boolean;
  uid?: string;
  id?: string;
  hall_of_owner?: string;
};

export type TicketProps = {
  ticket: ATicket;
};

export type YourTicketsProps = {
  loading: boolean;
  noTickets: boolean;
  tickets: ATicket[];
};

export type SummarizedCard = { course_code: string; count: number };

export type FullFlashcard = { answer: string; id: number; question: string };

export type PracticeModalProps = {
  header: string;
  dismiss: () => void;
};

export type UserDetails = {
  email: string;
  full_name: string;
  hall_of_residence: string;
  matric_no: string;
  phone_number: string;
};
