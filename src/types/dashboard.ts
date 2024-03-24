import React, { Dispatch, SetStateAction } from "react";
import { IconType } from "react-icons";

export type SidebarProps = {
  show: boolean;
  setShow: () => void;
};

export type MealTypes = "Breakfast" | "Lunch" | "Dinner";

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

export type User = {
  email: string;
  full_name: string;
  hall_of_residence: string;
  matric_no: string;
  phone_number: string;
  email_verified?: boolean;
  uid?: string;
  my_tickets?: string[];
  is_deliverer?: boolean;
};

export type Order = {
  meal_type: MealTypes;
  deliverer_id: string;
  date_ordered: string;
  status: "Not delivered" | "Delivered" | "Cancelled";
  ticket_date: string;
  orderer_id: string;
  id: string;
  room_number: string;
  amount_paid: { amount: string; charges: string };
  is_free: boolean;
};

export type Deliverer = User & {
  uid: string;
  amount_per_order: string;
  max_number_of_orders: string;
  bank_account_details: {
    account_number: string;
    bank_name: string;
    account_name: string;
  };
  schedule: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
  subaccount_code: string;
};

export type NewOrderProps = {
  setTab: Dispatch<SetStateAction<"new" | "past">>;
  deliverers: Deliverer[];
  orders: number;
};

export type PastOrdersProps = { orders: Order[]; deliverers: Deliverer[] };

export type DeliverersOrdersProps = { orders: Order[]; users: User[] };

export type CreateFlashcardProps = { course_codes: string[] };

export type CreateFlashcardWithoutCourseSelectProps = {
  course_code: string;
  close: Dispatch<SetStateAction<boolean>>;
};

export type UpdateFlashcardProps = {
  details: FullFlashcard;
  course_code: string;
  close: Dispatch<SetStateAction<FullFlashcard | null>>;
};

export type DashboardCardProps = {
  icon: IconType;
  title: string;
  value: string;
};

export type DelivererDetailsProps = {
  deliverer: Deliverer | undefined;
};

export type Summary = {
  deliverers_name: string;
  orders: number;
  delivered: number;
  not_delivered: number;
  cancelled: number;
  hostel: string;
  bank_details: {
    account_number: string;
    bank_name: string;
    account_name: string;
  };
  email: string;
  amount_due: number;
};

export type FreeOrderSummary = {
  deliverers_name: string | undefined;
  bank_details:
    | {
        account_number: string;
        bank_name: string;
        account_name: string;
      }
    | undefined;
  amount: string;
  email: string | undefined;
};

export type Event = {
  name: string;
  location: string;
  link: string;
  type: "Physical" | "Virtual";
  image: string;
  description: string;
  date_time: string;
  is_free: boolean;
  no_of_tickets: string;
  price_per_ticket: string;
  bank_account_details: {
    account_number: string;
    bank_name: string;
    account_name: string;
  };

  attendees: number;
  creator: string;
};
