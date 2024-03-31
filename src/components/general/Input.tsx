import { InputProps, SelectInputProps, TextareaProps } from "@/types/general";
import { classNames } from "@/utils/helpers";

const input_classes =
  "w-full border-2 border-blue outline-none py-2 px-3 rounded-lg bg-white";

export const SelectInput = ({ options, onChange, value }: SelectInputProps) => {
  return (
    <select
      className={classNames(input_classes, "py-2.5 px-2")}
      onChange={onChange}
      value={value}
    >
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

export const TextInput = ({
  placeholder,
  value,
  onChange,
  disabled,
}: InputProps) => {
  return (
    <input
      type="text"
      className={input_classes}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
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

export const PasswordInput = ({
  placeholder,
  value,
  onChange,
  type,
}: InputProps) => {
  return (
    <input
      type={type ? type : "password"}
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
      // maxLength={maxLength}
      max={maxLength}
    />
  );
};

export const Textarea = ({ onChange, value, placeholder }: TextareaProps) => {
  return (
    <textarea
      cols={10}
      rows={3}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className="w-full border-2 border-blue outline-none py-2 px-3 rounded-lg bg-white resize-y"
    />
  );
};
