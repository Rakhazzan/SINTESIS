const AuthFormButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      {children}
    </button>
  );
};

export default AuthFormButton;