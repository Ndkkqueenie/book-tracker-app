import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "default" | "icon";
  variant?: "default" | "outline";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  size = "default",
  variant = "default",
  className = "",
  ...props
}) => {
  let baseClasses =
    "flex items-center justify-center rounded-lg font-medium transition-colors";

  // Size
  if (size === "icon") baseClasses += " w-10 h-10 p-2";
  else baseClasses += " px-4 py-2";

  // Variant
  if (variant === "outline")
    baseClasses += " border border-gray-300 bg-white text-gray-700 hover:bg-gray-100";
  else baseClasses += " bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};
