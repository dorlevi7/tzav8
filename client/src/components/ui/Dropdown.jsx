import { useState } from "react";

function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select",
  renderOption,
  renderValue,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  const getLabel = (option) => {
    if (renderOption) return renderOption(option);
    return option;
  };

  const getSelectedLabel = () => {
    if (!value) return placeholder;

    if (renderValue) return renderValue(value);

    return getLabel(value);
  };

  return (
    <div className="dropdown">
      <button
        type="button"
        className="dropdown-button"
        onClick={() => setOpen(!open)}
      >
        {getSelectedLabel()}
        <span className="dropdown-arrow">▾</span>
      </button>

      {open && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option}
              className={`dropdown-item ${value === option ? "selected" : ""}`}
              onClick={() => handleSelect(option)}
            >
              {getLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
