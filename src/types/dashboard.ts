import React from "react";

export type SidebarProps = {
  show: boolean;
  setShow: () => void;
};

export type DashboardTemplateProps = {
  children: React.ReactNode;
};
