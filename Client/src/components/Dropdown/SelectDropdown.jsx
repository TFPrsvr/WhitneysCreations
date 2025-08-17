import React from 'react';

const SelectDropdown = ({ options, onSelectChange }) => {
  return (
    <select onChange={(e) => onSelectChange(e.target.value)}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectDropdown;