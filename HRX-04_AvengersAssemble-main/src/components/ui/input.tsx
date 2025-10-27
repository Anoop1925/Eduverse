import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <input
      className={`w-full px-4 py-2 rounded-lg bg-white/10 text-gray-900 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  );
};

export { Input };
