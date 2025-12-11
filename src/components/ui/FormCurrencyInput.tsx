import { formatNumber } from '@/utils/formatters'

interface FormCurrencyInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
  id?: string
}

export const FormCurrencyInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder = '0',
  id,
}: FormCurrencyInputProps) => {
  return (
    <div>
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 relative rounded-xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">Rp</span>
        </div>
        <input
          type="text"
          name={name}
          id={id || name}
          required={required}
          value={value ? formatNumber(value) : ''}
          onChange={onChange}
          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
