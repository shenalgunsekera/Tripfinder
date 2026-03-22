type InitialAvatarProps = {
  name: string;
  className?: string;
  textClassName?: string;
};

export default function InitialAvatar({
  name,
  className = "",
  textClassName = "",
}: InitialAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      aria-label={name}
      className={`flex items-center justify-center rounded-full bg-primary text-white ${className}`.trim()}
    >
      <span className={`font-semibold ${textClassName}`.trim()}>{initial}</span>
    </div>
  );
}
