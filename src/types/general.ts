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
  disabled?: boolean;
};

export type TextareaProps = {
  placeholder?: string;
  value: string;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  maxLength?: number;
};

export type SelectInputProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: { value: string; text: string }[];
};
