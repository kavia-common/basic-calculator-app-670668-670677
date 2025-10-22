import React, { useCallback, useEffect, useMemo, useState } from "react";
import KeyButton from "./KeyButton";

/**
 * PUBLIC_INTERFACE
 * Calculator - A functional, minimalist calculator supporting +, -, ×, ÷ with keyboard support.
 *
 * Display: right-aligned, shows current input or result. Handles Error state for division by zero.
 * Keyboard: digits (0-9), operators (+ - * /), Enter/Return (=), Backspace (delete last), Escape (clear), period (.).
 */
export default function Calculator() {
  // Calculator state
  const [currentValue, setCurrentValue] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(false);
  const [error, setError] = useState(false);

  const isOperatorActive = useMemo(() => ({
    "+": operator === "+",
    "-": operator === "-",
    "×": operator === "×",
    "÷": operator === "÷",
  }), [operator]);

  // Helpers
  const sanitizeNumberString = (str) => {
    // Trim leading zeros unless it's "0" or a decimal like "0.xxx"
    if (!str) return "0";
    if (str === "0") return "0";
    if (str.startsWith("0") && !str.startsWith("0.") && str.length > 1) {
      // remove leading zeros
      const trimmed = String(Number(str));
      return trimmed;
    }
    return str;
  };

  const compute = useCallback((aStr, bStr, op) => {
    const a = parseFloat(aStr);
    const b = parseFloat(bStr);
    if (Number.isNaN(a) || Number.isNaN(b)) return "0";

    switch (op) {
      case "+":
        return String(a + b);
      case "-":
        return String(a - b);
      case "×":
        return String(a * b);
      case "÷":
        if (b === 0) return "Error";
        return String(a / b);
      default:
        return bStr;
    }
  }, []);

  const resetAll = useCallback(() => {
    setCurrentValue("0");
    setPreviousValue(null);
    setOperator(null);
    setOverwrite(false);
    setError(false);
  }, []);

  // Actions
  const onClear = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const onBackspace = useCallback(() => {
    if (error) {
      resetAll();
      return;
    }
    if (overwrite) {
      setCurrentValue("0");
      setOverwrite(false);
      return;
    }
    setCurrentValue((val) => {
      if (val.length <= 1) return "0";
      const next = val.slice(0, -1);
      return next === "-" ? "0" : next;
    });
  }, [overwrite, resetAll, error]);

  const onDigit = useCallback((d) => {
    if (error) {
      // Reset on next input
      setError(false);
      setCurrentValue(String(d));
      setOverwrite(false);
      setPreviousValue(null);
      setOperator(null);
      return;
    }

    setCurrentValue((val) => {
      if (overwrite) {
        setOverwrite(false);
        return String(d);
      }
      const next = val === "0" ? String(d) : `${val}${d}`;
      return sanitizeNumberString(next);
    });
  }, [overwrite, error]);

  const onDecimal = useCallback(() => {
    if (error) {
      setError(false);
      setCurrentValue("0.");
      setOverwrite(false);
      setPreviousValue(null);
      setOperator(null);
      return;
    }
    setCurrentValue((val) => {
      if (overwrite) {
        setOverwrite(false);
        return "0.";
      }
      if (val.includes(".")) return val;
      return `${val}.`;
    });
  }, [overwrite, error]);

  const onOperator = useCallback((op) => {
    if (error) {
      // ignore operators until reset on next input
      return;
    }
    // Chain operations: if previous and operator exist, compute intermediate
    if (previousValue !== null && operator !== null && !overwrite) {
      const result = compute(previousValue, currentValue, operator);
      if (result === "Error") {
        setError(true);
        setCurrentValue("Error");
        setPreviousValue(null);
        setOperator(null);
        setOverwrite(true);
        return;
      }
      setPreviousValue(result);
      setCurrentValue(result);
    } else {
      setPreviousValue(currentValue);
    }
    // Set new operator and prepare to overwrite on next digit
    setOperator(op);
    setOverwrite(true);
  }, [compute, currentValue, operator, overwrite, previousValue, error]);

  const onEquals = useCallback(() => {
    if (error) {
      resetAll();
      return;
    }
    if (previousValue === null || operator === null) return;
    const result = compute(previousValue, currentValue, operator);
    if (result === "Error") {
      setError(true);
      setCurrentValue("Error");
      setPreviousValue(null);
      setOperator(null);
      setOverwrite(true);
      return;
    }
    setCurrentValue(result);
    setPreviousValue(null);
    setOperator(null);
    setOverwrite(true);
  }, [compute, currentValue, operator, previousValue, resetAll, error]);

  // Keyboard support
  const onKeyDown = useCallback((e) => {
    const { key } = e;
    if ((key >= "0" && key <= "9")) {
      e.preventDefault();
      onDigit(key);
      return;
    }
    if (key === "." || key === ",") {
      e.preventDefault();
      onDecimal();
      return;
    }
    if (key === "+" || key === "-") {
      e.preventDefault();
      onOperator(key);
      return;
    }
    if (key === "*" ) {
      e.preventDefault();
      onOperator("×");
      return;
    }
    if (key === "/") {
      e.preventDefault();
      onOperator("÷");
      return;
    }
    if (key === "Enter" || key === "=") {
      e.preventDefault();
      onEquals();
      return;
    }
    if (key === "Backspace") {
      e.preventDefault();
      onBackspace();
      return;
    }
    if (key === "Escape") {
      e.preventDefault();
      onClear();
      return;
    }
  }, [onBackspace, onClear, onDecimal, onDigit, onEquals, onOperator]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Formatting: limit length and trim trailing decimal dot
  const displayValue = useMemo(() => {
    if (error) return "Error";
    let val = currentValue;
    if (val.endsWith(".")) return val;
    // Normalize like 05 -> 5
    val = sanitizeNumberString(val);
    // Limit display length for aesthetics
    if (val.length > 14) {
      // Try to format with exponential if too long
      const num = Number(val);
      if (!Number.isNaN(num)) {
        return num.toPrecision(10).replace(/\.?0+$/, "");
      }
    }
    return val;
  }, [currentValue, error]);

  return (
    <div className="calc-container" role="application" aria-label="Basic calculator">
      <div className={`calc-card${error ? " error" : ""}`}>
        <div className="calc-header">
          <h1 className="app-title" aria-label="Calculator">Calculator</h1>
        </div>
        <div className="calc-display" aria-live="polite" aria-atomic="true">
          <div className="display-text" data-testid="display">
            {displayValue}
          </div>
        </div>

        <div className="calc-grid" role="group" aria-label="Keypad">
          <KeyButton label="C" variant="control" title="Clear" onClick={onClear} />
          <KeyButton label="⌫" variant="control" title="Backspace" onClick={onBackspace} />
          <KeyButton
            label="÷"
            variant="operator"
            title="Divide"
            ariaPressed={isOperatorActive["÷"]}
            onClick={() => onOperator("÷")}
          />
          <KeyButton
            label="×"
            variant="operator"
            title="Multiply"
            ariaPressed={isOperatorActive["×"]}
            onClick={() => onOperator("×")}
          />

          <KeyButton label="7" onClick={() => onDigit("7")} />
          <KeyButton label="8" onClick={() => onDigit("8")} />
          <KeyButton label="9" onClick={() => onDigit("9")} />
          <KeyButton
            label="-"
            variant="operator"
            title="Subtract"
            ariaPressed={isOperatorActive["-"]}
            onClick={() => onOperator("-")}
          />

          <KeyButton label="4" onClick={() => onDigit("4")} />
          <KeyButton label="5" onClick={() => onDigit("5")} />
          <KeyButton label="6" onClick={() => onDigit("6")} />
          <KeyButton
            label="+"
            variant="operator"
            title="Add"
            ariaPressed={isOperatorActive["+"]}
            onClick={() => onOperator("+")}
          />

          <KeyButton label="1" onClick={() => onDigit("1")} />
          <KeyButton label="2" onClick={() => onDigit("2")} />
          <KeyButton label="3" onClick={() => onDigit("3")} />
          <KeyButton
            label="="
            variant="equals"
            title="Equals"
            onClick={onEquals}
          />

          <KeyButton label="0" grow={2} onClick={() => onDigit("0")} />
          <KeyButton label="." title="Decimal" onClick={onDecimal} />
          {/* empty spacer to align grid? Equals took one at previous row so layout remains 4 columns */}
          <div className="grid-spacer" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
