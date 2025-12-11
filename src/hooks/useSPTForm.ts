'use client'

import { useState, useCallback, useEffect } from 'react'
import { SPTFormData } from '@/types'
import { INITIAL_FORM_STATE } from '@/constants'
import { getTodayISO } from '@/utils/formatters'
import { createSubmission } from '@/services/submissionService'
import { downloadPdf } from '@/services/pdfService'

export const useSPTForm = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<SPTFormData>(INITIAL_FORM_STATE)

  // Set default date for "Tanggal Pembuatan SPT" to today on mount
  useEffect(() => {
    setFormData((prev) => ({ ...prev, tanggal_pembuatan_spt: getTodayISO() }))
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleNominalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, '')
      setFormData((prev) => ({ ...prev, nominal_angsuran: rawValue }))
    },
    []
  )

  const setTodayDate = useCallback(() => {
    setFormData((prev) => ({ ...prev, tanggal_pembuatan_spt: getTodayISO() }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      ...INITIAL_FORM_STATE,
      tanggal_pembuatan_spt: getTodayISO(),
    })
  }, [])

  const submitForm = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    try {
      // Save to Supabase
      await createSubmission(formData)

      // Generate and Download PDF
      await downloadPdf(formData)

      // Reset form
      resetForm()

      return true
    } catch (error) {
      console.error('Error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [formData, resetForm])

  return {
    formData,
    loading,
    handleChange,
    handleNominalChange,
    setTodayDate,
    resetForm,
    submitForm,
  }
}
