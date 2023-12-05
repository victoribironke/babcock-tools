import React, {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLInputTypeAttribute,
} from "react";

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
  placeholder?: string;
  value: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  maxLength?: number;
  type?: HTMLInputTypeAttribute;
};

export type SelectInputProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: { value: string; text: string }[];
};
