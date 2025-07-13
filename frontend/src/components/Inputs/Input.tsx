import { ChangeEvent } from "react";

interface Option {
  value: string;
  label: string;
}

interface InputProps {
  placeholder: string;
  type: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  options?: Option[];
  errorMessage?: string;  // nova prop para erro
  name?: string;
  id?: string;
}

const Input = ({
  placeholder,
  type,
  value,
  onChange,
  required,
  options,
  errorMessage,
  name,
  id,
}: InputProps) => {
  if (type === "select") {
    return (
      <div className="w-full max-w-[450px]">
        <select
          className={`w-full h-[50px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errorMessage ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
          value={value}
          onChange={onChange}
          required={required}
          name={name}
          id={id}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options?.map(({ value: optValue, label }) => (
            <option key={optValue} value={optValue}>
              {label}
            </option>
          ))}
        </select>
        {errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[450px]">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        name={name}
        id={id}
        className={`w-full h-[50px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          errorMessage ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
        }`}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;
