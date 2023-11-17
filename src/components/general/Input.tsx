import { InputProps, SelectInputProps } from "@/types/general";

const input_classes =
  "w-full border-2 border-blue outline-none py-2 px-3 rounded-lg";

export const SelectInput = ({ options, onChange, value }: SelectInputProps) => {
  return (
    <select className={input_classes} onChange={onChange} value={value}>
      {options.map((op, i) => (
        <option value={op.value} key={i}>
          {op.text}
        </option>
      ))}
    </select>
  );
};

export const DateInput = ({ onChange, value }: InputProps) => {
  return (
    <input
      type="date"
      className={input_classes}
      value={value}
      min={new Date().toISOString().split("T")[0]}
      onChange={onChange}
    />
  );
};

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

export const NumberInput = ({
  placeholder,
  value,
  maxLength,
  onChange,
  onBlur,
}: InputProps) => {
  return (
    <input
      type="number"
      className={input_classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      maxLength={maxLength}
    />
  );
};
