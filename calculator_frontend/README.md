# Ocean Professional Calculator (React)

A modern, minimalist calculator built with React (functional components + hooks). Styled with an Ocean Professional theme using pure CSS.

## Features

- Basic operations: add (+), subtract (-), multiply (×), divide (÷)
- Chained operations (e.g., 2 + 3 × 4 = 14)
- Right-aligned display, large digits
- Keyboard support:
  - Digits (0-9), Decimal (.), Operators (+ - * /)
  - Enter or = to evaluate
  - Backspace to delete last digit
  - Escape to clear
- Division-by-zero safety (shows "Error" and resets on next input)
- Accessible buttons (aria-pressed on active operator, roles, titles)
- Ocean Professional theme (rounded card, shadows, subtle transitions)

## Scripts

- `npm start` — run dev server on port 3000 (or next available)
- `npm test` — run tests
- `npm run build` — production build

## Structure

- `src/components/Calculator.jsx` — UI + logic
- `src/components/KeyButton.jsx` — accessible, reusable button
- `src/App.js` — app entry rendering the calculator
- `src/styles.css` — app styles (Ocean Professional)

## Notes

- No external services required. Minimal state is kept in the `Calculator` component:
  - `currentValue`, `previousValue`, `operator`, `overwrite`, `error`
- All configuration is local; no environment variables needed.
