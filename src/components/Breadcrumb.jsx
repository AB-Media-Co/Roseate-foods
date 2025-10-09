import React from "react";
import { Link, useLocation } from "react-router-dom";

const safeDecode = (str = "") => {
  try {
    return decodeURIComponent(str);
  } catch {
    return str; // fallback: return raw if decode fails
  }
};



const Breadcrumb = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathParts.map((part, idx) => {
    // decode special characters like %20, %7C etc.
  let label = safeDecode(part)
    .replace(/-/g, " ")
    .replace(/\|/g, " | ");
  label = label.charAt(0).toUpperCase() + label.slice(1);

    const pathTo = "/" + pathParts.slice(0, idx + 1).join("/");
    const isLast = idx === pathParts.length - 1;

    return (
      <li key={pathTo} className="flex items-center">
        {!isLast ? (
          <>
            <Link
              // to={pathTo}
              className="text-gray-600 hover:text-black transition"
            >
              {label}
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </>
        ) : (
          <span className="text-gray-800 font-semibold">{label}</span>
        )}
      </li>
    );
  });

  return (
    <nav className="text-sm my-6 content" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link to="/" className="text-gray-600 hover:text-black transition">
            Home
          </Link>
          {breadcrumbs.length > 0 && (
            <span className="mx-2 text-gray-400">/</span>
          )}
        </li>
        {breadcrumbs}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
