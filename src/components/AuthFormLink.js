const AuthFormLink = ({ children, onClick }) => {
  return (
    <p className="mt-4 text-center text-gray-600">
      <span 
        onClick={onClick} 
        className="text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        {children}
      </span>
    </p>
  );
};

export default AuthFormLink;