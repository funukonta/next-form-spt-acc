'use client'

import { useState, useMemo } from 'react'
import { Submission, ParsedContent } from '@/types'
import { Download, Loader2, RefreshCw } from 'lucide-react'
import { Pagination } from '@/components/ui'

const ITEMS_PER_PAGE = 10

interface SubmissionsListProps {
  submissions: Submission[]
  loading: boolean
  generatingId: string | null
  onRefresh: () => void
  onDownloadPdf: (submission: Submission) => void
  onDownloadExcel: () => void
  parseSubmissionContent: (content: string) => ParsedContent | null
}

export const SubmissionsList = ({
  submissions,
  loading,
  generatingId,
  onRefresh,
  onDownloadPdf,
  onDownloadExcel,
  parseSubmissionContent,
}: SubmissionsListProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination values
  const totalItems = submissions.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  // Get paginated submissions
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return submissions.slice(startIndex, endIndex)
  }, [submissions, currentPage])

  // Reset to page 1 when submissions change (e.g., after refresh)
  const handleRefresh = () => {
    setCurrentPage(1)
    onRefresh()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Filled Forms</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage all form submissions.</p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onDownloadExcel}
            className="inline-flex items-center rounded-xl text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-green-500 font-medium text-sm px-4 py-2.5 text-center leading-5"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Download Excel</span>
            <span className="sm:hidden">Excel</span>
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

      </div>

        <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
        </div>

      <div className="bg-white shadow-xl shadow-gray-200 overflow-hidden sm:rounded-2xl border border-gray-100">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No submissions yet.</div>
        ) : (
          <>
            <ul className="divide-y divide-gray-100">
              {paginatedSubmissions.map((submission) => {
              const parsed = parseSubmissionContent(submission.content)
              return (
                <li key={submission.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="px-6 py-5 sm:px-8">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {parsed ? parsed.nama_customer : submission.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {parsed ? `Kontrak: ${parsed.nomor_kontrak}` : submission.email}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => onDownloadPdf(submission)}
                          disabled={generatingId === submission.id}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                        >
                          {generatingId === submission.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          {generatingId === submission.id ? 'Generating...' : 'Download PDF'}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {parsed ? (
                          <>
                            <p>
                              <span className="font-medium">Nama ARHO:</span>{' '}
                              <b>{parsed.nama_arho}</b>
                            </p>
                            <p>
                              <span className="font-medium">Jatuh Tempo:</span>{' '}
                              <b>{parsed.tanggal_jatuh_tempo}</b>
                            </p>
                            <p>
                              <span className="font-medium">Nominal:</span>{' '}
                              <b>Rp {Number(parsed.nominal_angsuran).toLocaleString('id-ID')}</b>
                            </p>
                            <p>
                              <span className="font-medium">Angsuran Ke:</span>{' '}
                              <b>{parsed.angsuran_ke}</b>
                            </p>
                            <p>
                              <span className="font-medium">Maksimal Bayar:</span>{' '}
                              <b>{parsed.tanggal_maksimal_pembayaran}</b>
                            </p>
                          </>
                        ) : (
                          <p>{submission.content}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-xs text-gray-400">
                          Submitted on {new Date(submission.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
            </ul>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </section>
  )
}
