export const Input = ({ name, value, onChange, placeholder, className = "" }) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border-b border-gray-300 px-2 py-3 text-sm focus:outline-none focus:border-blue-500 placeholder:text-gray-400 ${className}`}
    />
  );
};
