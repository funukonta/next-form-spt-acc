'use client'

import { useState, useCallback } from 'react'
import { Submission, User } from '@/types'
import {
  fetchSubmissions as fetchSubmissionsService,
  parseSubmissionContent,
} from '@/services/submissionService'
import {
  fetchUsers as fetchUsersService,
  createUser as createUserService,
  deleteUser as deleteUserService,
} from '@/services/userService'
import { downloadPdf } from '@/services/pdfService'
import { downloadExcel } from '@/services/excelService'

export const useAdminData = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingId, setGeneratingId] = useState<string | null>(null)

  const fetchSubmissions = useCallback(async () => {
    try {
      const data = await fetchSubmissionsService()
      setSubmissions(data)
    } catch (error) {
      console.error('Error fetching submissions:', error)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const data = await fetchUsersService()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchSubmissions(), fetchUsers()])
    setLoading(false)
  }, [fetchSubmissions, fetchUsers])

  const handleDownloadPdf = useCallback(async (submission: Submission) => {
    setGeneratingId(submission.id)
    try {
      const parsed = parseSubmissionContent(submission.content)
      if (!parsed) {
        throw new Error('Invalid data format for this submission')
      }
      await downloadPdf(parsed)
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    } finally {
      setGeneratingId(null)
    }
  }, [])

  const handleDownloadExcel = useCallback(() => {
    try {
      downloadExcel(submissions)
    } catch (error) {
      console.error('Error generating Excel:', error)
      throw error
    }
  }, [submissions])

  const handleCreateUser = useCallback(
    async (email: string, password: string, role: string) => {
      await createUserService(email, password, role)
      await fetchUsers()
    },
    [fetchUsers]
  )

  const handleDeleteUser = useCallback(
    async (id: string) => {
      await deleteUserService(id)
      await fetchUsers()
    },
    [fetchUsers]
  )

  return {
    submissions,
    users,
    loading,
    generatingId,
    fetchAllData,
    fetchSubmissions,
    fetchUsers,
    handleDownloadPdf,
    handleDownloadExcel,
    handleCreateUser,
    handleDeleteUser,
    parseSubmissionContent,
  }
}
