import React from 'react'

// Common Button Component for entire website
const Button = ({
    children,
    variant = "default",
    size = "default",
    className = "",
    href,
    ...props
}) => {
    const baseStyles = "inline-flex cursor-pointer items-center justify-center font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        default: "bg-brand-500 text-white hover:bg-brand-600 ",
        ghost: "bg-transparent hover:bg-white/10 text-current",
        link: "bg-transparent hover:underline text-current",
        outline: "border-2 border-current bg-transparent hover:bg-white/10",
        solid: "bg-white text-gray-900 hover:bg-gray-100",
    };

    const sizes = {
        default: "px-4 py-2 text-sm rounded-md",
        sm: "px-3 py-1.5 text-xs rounded",
        lg: "px-6 py-3 text-base rounded-lg",
        icon: "p-1.5 rounded",
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    // If href is provided, render as anchor tag
    if (href) {
        return (
            <a href={href}
                className={combinedClassName}
                {...props}>
                {children}
            </a>
        );
    }

    // Otherwise render as button
    return (
        <button
            className={combinedClassName}
            {...props}
        >
            {children}
        </button>
    );
};


export default Button