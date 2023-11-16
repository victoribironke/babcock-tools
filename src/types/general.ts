import React from "react";

export type ModalProps = {
  header: string;
  dismiss: () => void;
  children: React.ReactNode;
};

export type HeadTemplateProps = {
  title?: string;
};

export type PageLoaderProps = {
  type: "full" | "small";
};
