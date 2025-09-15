const FormSelect = ({ options, value, onChange, className = '' }) => (
    <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm dark:text-gray-200 dark:bg-bodybg ${className}`}
    >
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

export default FormSelect;