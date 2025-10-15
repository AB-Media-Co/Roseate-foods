import React from "react";

export default function Empty({
  title = "No data",
  message = "There is nothing to show right now.",
  className = "",
  icon = null,
}) {
  return (
    <div className={`py-10 flex flex-col items-center justify-center text-center ${className}`}>
      {icon ?? (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-300 mb-2"
        >
          <path d="M19 21H5a2 2 0 01-2-2V7l4-4h12a2 2 0 012 2v14a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 3v4H5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )}
      <div className="text-body font-semibold text-gray-800">{title}</div>
      {message ? (
        <div className="text-small text-gray-500 mt-1">{message}</div>
      ) : null}
    </div>
  );
}


