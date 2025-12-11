interface FormSelectProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: readonly string[]
  required?: boolean
  placeholder?: string
  id?: string
}

export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder = 'Select...',
  id,
}: FormSelectProps) => {
  return (
    <div>
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        id={id || name}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
