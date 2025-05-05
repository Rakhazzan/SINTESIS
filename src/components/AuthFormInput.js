const AuthFormInput = ({ type, placeholder, value, onChange, name, required, minLength }) => {
  const handleInputChange = (e) => {
    onChange({
      target: {
        name: name,
        value: e.target.value
      }
    });
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={handleInputChange}
      name={name}
      required={required}
      minLength={minLength}
      className="w-full px-4 py-2 mt-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  );
};

export default AuthFormInput;