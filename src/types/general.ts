import React, { ChangeEventHandler } from "react";

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

export type InputProps = {
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};
