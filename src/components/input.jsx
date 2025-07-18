import React from 'react';

export default function Input({
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  label,
  maxLength,
  minLength,
  className = ''
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  );
}
