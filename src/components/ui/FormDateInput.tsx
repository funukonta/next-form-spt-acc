interface FormDateInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  id?: string
  showTodayButton?: boolean
  onTodayClick?: () => void
}

export const FormDateInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  id,
  showTodayButton = false,
  onTodayClick,
}: FormDateInputProps) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {showTodayButton && onTodayClick && (
          <button
            type="button"
            onClick={onTodayClick}
            className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
          >
            Click for Today
          </button>
        )}
      </div>
      <input
        type="date"
        name={name}
        id={id || name}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
      />
    </div>
  )
}
