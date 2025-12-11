interface FormInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: 'text' | 'number' | 'email' | 'password' | 'date'
  required?: boolean
  placeholder?: string
  id?: string
}

export const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  id,
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={id || name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
      />
    </div>
  )
}
