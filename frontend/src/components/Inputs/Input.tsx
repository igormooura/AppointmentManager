import { ChangeEvent } from 'react';

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
  options?: Option[]
}

const Input = ({ placeholder, type, value, onChange, required, options }: InputProps) => {

    if (type === "select") {
    return (
      <div className="w-full max-w-[450px] h-[50px]">
        <select
          className="w-full h-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value='' disabled>
            {placeholder}
          </option>
          {options?.map(({value: optValue, label}) => (
            <option key={optValue} value={optValue}>
              {label}
            </option>
          ))}
          </select>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[450px] h-[50px]">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
