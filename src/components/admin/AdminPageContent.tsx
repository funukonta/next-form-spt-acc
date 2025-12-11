'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminData } from '@/hooks'
import { getUserSession } from '@/services/userService'
import { Submission } from '@/types'
import Header from '@/components/Header'
import { SubmissionsList } from '@/components/admin/SubmissionsList'

export default function AdminPage() {
  const router = useRouter()
  const {
    submissions,
    loading,
    generatingId,
    fetchAllData,
    fetchSubmissions,
    handleDownloadPdf,
    handleDownloadExcel,
    parseSubmissionContent,
  } = useAdminData()

  useEffect(() => {
    const checkAuth = () => {
      const user = getUserSession()
      if (!user) {
        router.push('/login')
        return
      }
      if (user.role !== 'admin') {
        alert('Access Denied: Admins only')
        router.push('/')
        return
      }
      fetchAllData()
    }
    checkAuth()
  }, [router, fetchAllData])

  const onDownloadPdf = async (submission: Submission) => {
    try {
      await handleDownloadPdf(submission)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert('Error generating PDF: ' + message)
    }
  }

  const onDownloadExcel = () => {
    try {
      handleDownloadExcel()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert('Error generating Excel: ' + message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SubmissionsList
            submissions={submissions}
            loading={loading}
            generatingId={generatingId}
            onRefresh={fetchSubmissions}
            onDownloadPdf={onDownloadPdf}
            onDownloadExcel={onDownloadExcel}
            parseSubmissionContent={parseSubmissionContent}
          />
        </div>
      </main>
    </div>
  )
}
