import PropTypes from 'prop-types';

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

SelectDropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  onSelectChange: PropTypes.func.isRequired
};

export default SelectDropdown;