import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-md ${className}`}>
      {children}
    </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);
