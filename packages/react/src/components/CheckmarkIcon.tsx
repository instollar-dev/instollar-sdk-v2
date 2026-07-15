/** Shared checkmark glyph for Checkbox and multi-Select option rows. */
export function CheckmarkIcon({
  color,
  size = 12,
}: {
  color: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M2.5 6.2L5.1 8.8L9.5 3.5"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
