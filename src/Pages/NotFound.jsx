import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] px-4 py-16 flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-50 text-brand-600 border border-brand-100 mb-6">
          <span className="text-2xl font-bold">404</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button size="lg" variant="default" className="shadow-sm">
              Go to Home
            </Button>
          </Link>
          <Link to="/collection/allproducts">
            <Button size="lg" variant="solid" className="border border-gray-200">
              Browse Products
            </Button>
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          <p>
            If you believe this is a mistake, please contact our support team via the
            <Link to="/contact" className="underline ml-1">Contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


