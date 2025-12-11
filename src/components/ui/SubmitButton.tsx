import { LoadingSpinner } from './LoadingSpinner'

interface SubmitButtonProps {
  loading: boolean
  loadingText?: string
  children: React.ReactNode
  className?: string
}

export const SubmitButton = ({
  loading,
  loadingText = 'Loading...',
  children,
  className = '',
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 ${className}`}
    >
      {loading ? (
        <span className="flex items-center">
          <LoadingSpinner size="md" className="-ml-1 mr-3 text-white" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
