const FormInput = ({ type = 'text', placeholder, value, onChange, className = '', ...props }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${className}`}
        {...props}
    />
);

export default FormInput;