import React from "react";

/**
 * KeyButton - Reusable calculator button with accessibility and theming.
 *
 * Props:
 * - label: string - Text to display on the button
 * - onClick: function - Click handler
 * - variant: 'default' | 'operator' | 'equals' | 'control' - Style variant
 * - grow: number - Grid column span for layout (optional)
 * - ariaPressed: boolean - Whether the button is in active/pressed state (for operators)
 * - title: string - Accessible label/tooltip text
 */
export default function KeyButton({
  label,
  onClick,
  variant = "default",
  grow = 1,
  ariaPressed = false,
  title,
}) {
  return (
    <button
      type="button"
      className={`key ${variant}`}
      style={{ gridColumn: `span ${grow}` }}
      onClick={onClick}
      aria-pressed={ariaPressed}
      title={title || label}
    >
      {label}
    </button>
  );
}
