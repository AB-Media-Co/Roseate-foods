export const BrandHeading = ({ 
    children, 
    accentWord, 
    className = "text-subheading text-brand-500 uppercase text",
    accentClassName = "font-knewave",
    as: Component = "h2"
  }) => {
    return (
      <Component className={` ${className} `}>
        {children} <span className={accentClassName}>{accentWord}</span>
      </Component>
    );
  };