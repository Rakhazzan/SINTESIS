const AuthFormSelect = ({ options, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 mt-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default AuthFormSelect;