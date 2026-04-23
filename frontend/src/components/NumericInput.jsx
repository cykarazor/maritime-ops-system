import { useState, useEffect } from "react";

export const NumericInput = ({
  name,
  value,
  onChange,
  onBlur,
  label,
  nullable = true,
  decimals = 2,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  // =========================
  // SYNC FROM FORM ENGINE
  // =========================
  useEffect(() => {
    if (value === null || value === undefined) {
      setDisplayValue("");
    } else {
      setDisplayValue(String(value));
    }
  }, [value]);

  // =========================
  // HANDLE TYPING
  // =========================
  const handleChange = (e) => {
    const val = e.target.value;

    // allow raw typing (VERY IMPORTANT)
    if (val === "" || val === "." || val.endsWith(".")) {
      setDisplayValue(val);
      onChange?.({
        target: { name, value: val },
      });
      return;
    }

    // numeric validation
    const num = Number(val);

    if (Number.isNaN(num)) {
      return;
    }

    setDisplayValue(val);

    onChange?.({
      target: { name, value: val },
    });
  };

  // =========================
  // FORMAT ON BLUR ONLY
  // =========================
  const handleBlur = (e) => {
    let val = displayValue;

    if (val === "" && nullable) {
      setDisplayValue("");
      onChange?.({
        target: { name, value: "" },
      });
      onBlur?.(e);
      return;
    }

    const num = Number(val);

    if (!Number.isNaN(num)) {
      const formatted = num.toFixed(decimals);
      setDisplayValue(formatted);

      onChange?.({
        target: { name, value: num },
      });
    }

    onBlur?.(e);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div>
      {label && <label>{label}</label>}

      <input
        type="text"
        inputMode="decimal"
        name={name}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};