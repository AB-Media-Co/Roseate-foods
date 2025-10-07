export const StarburstBadge = ({
  title,
  icon,
  para,
  starburstImage = "/Home/farms/Star.svg",
  iconSize = "w-[60px] h-[60px] md:w-[90px] md:h-[90px]",
  badgeSize = "w-36 h-36 md:w-40 md:h-40",
  titleClassName = "text-small font-semibold text-brand-500 text-center tracking-wide",
  titleParaName = "text-small font-semibold text-brand-500 text-center tracking-wide",
  containerClassName = "flex flex-col items-center gap-4",
}) => {
  return (
    <div className={containerClassName}>
      {/* Starburst badge */}
      <div
        className={`relative ${badgeSize} shrink-0 bg-contain bg-no-repeat bg-center`}
        style={{ backgroundImage: `url('${starburstImage}')` }}
        aria-hidden="true"
      >
        {/* inner circle with icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={icon}
            alt=""
            className={iconSize}
            loading="lazy"
          />
        </div>
      </div>

      <p className={titleClassName}>
        {title}
      </p>
      <p className={titleParaName}>
        {para}
      </p>
    </div>
  );
};
