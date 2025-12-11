import * as XLSX from 'xlsx'
import { Submission } from '@/types'
import { parseSubmissionContent } from './submissionService'

interface ExcelRow {
  No: number
  'Nama Customer': string
  'Nomor Kontrak': string
  'Nomor Langganan': string
  'Angsuran Ke': string
  'Nominal Angsuran': number
  'Tanggal Jatuh Tempo': string
  'Tanggal Maksimal Pembayaran': string
  'Tanggal Pembuatan SPT': string
  'Submitted At': string
}

/**
 * Transform submissions to Excel-friendly format
 */
const transformToExcelData = (submissions: Submission[]): ExcelRow[] => {
  return submissions
    .map((submission, index) => {
      const parsed = parseSubmissionContent(submission.content)
      if (!parsed) return null

      return {
        No: index + 1,
        'Nama Customer': parsed.nama_customer,
        'Nomor Kontrak': parsed.nomor_kontrak,
        'Nomor Langganan': parsed.nomor_langganan,
        'Angsuran Ke': parsed.angsuran_ke,
        'Nominal Angsuran': Number(parsed.nominal_angsuran),
        'Tanggal Jatuh Tempo': parsed.tanggal_jatuh_tempo,
        'Tanggal Maksimal Pembayaran': parsed.tanggal_maksimal_pembayaran,
        'Tanggal Pembuatan SPT': parsed.tanggal_pembuatan_spt,
        'Submitted At': new Date(submission.created_at).toLocaleString('id-ID'),
      }
    })
    .filter((row): row is ExcelRow => row !== null)
}

/**
 * Download submissions as Excel file
 */
export const downloadExcel = (submissions: Submission[]): void => {
  const excelData = transformToExcelData(submissions)

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData)

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 }, // No
    { wch: 25 }, // Nama Customer
    { wch: 20 }, // Nomor Kontrak
    { wch: 20 }, // Nomor Langganan
    { wch: 12 }, // Angsuran Ke
    { wch: 18 }, // Nominal Angsuran
    { wch: 20 }, // Tanggal Jatuh Tempo
    { wch: 25 }, // Tanggal Maksimal Pembayaran
    { wch: 20 }, // Tanggal Pembuatan SPT
    { wch: 22 }, // Submitted At
  ]

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions')

  // Generate filename with current date
  const dateStr = new Date().toISOString().split('T')[0]
  const filename = `Form_Submissions_${dateStr}.xlsx`

  // Download file
  XLSX.writeFile(workbook, filename)
}
