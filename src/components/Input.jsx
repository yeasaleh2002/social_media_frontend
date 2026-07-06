import React from 'react';
import { useDesignScale } from '../hooks/useDesignScale';

export default function Input({ label, type = 'text', value, onChange, placeholder, className = '', ...props }) {
  const { d } = useDesignScale();

  return (
    <div className={`flex flex-col ${className}`} style={{ marginBottom: `${d(16)}px` }}>
      {label && (
        <label 
          className="text-gray-700 font-medium" 
          style={{ marginBottom: `${d(8)}px`, fontSize: `${d(14)}px` }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: `${d(12)}px`,
          fontSize: `${d(16)}px`,
          borderRadius: `${d(8)}px`,
          borderWidth: `${d(1)}px`
        }}
        className="border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        {...props}
      />
    </div>
  );
}
