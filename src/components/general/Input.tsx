import { InputProps } from "@/types/general";

const input_classes =
  "w-full border-2 border-blue outline-none py-2 px-3 rounded-md";

export const TextInput = ({ placeholder, value, onChange }: InputProps) => {
  return (
    <input
      type="text"
      className={input_classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export const EmailInput = ({ placeholder, value, onChange }: InputProps) => {
  return (
    <input
      type="email"
      className={input_classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export const PasswordInput = ({ placeholder, value, onChange }: InputProps) => {
  return (
    <input
      type="password"
      className={input_classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
