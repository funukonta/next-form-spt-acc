import { pdf } from '@react-pdf/renderer'
import PdfDocument from '@/components/PdfDocument'
import { SPTFormData } from '@/types'

/**
 * Generate PDF blob from form data
 */
export const generatePdfBlob = async (data: SPTFormData): Promise<Blob> => {
  const blob = await pdf(<PdfDocument data={data} />).toBlob()
  return blob
}

/**
 * Generate filename for SPT PDF
 */
export const generatePdfFilename = (data: SPTFormData): string => {
  const sanitizedName = data.nama_customer.replace(/\s/g, '_')
  return `SPT-${data.nomor_kontrak}-${sanitizedName}.pdf`
}

/**
 * Download PDF file
 */
export const downloadPdf = async (data: SPTFormData): Promise<void> => {
  const blob = await generatePdfBlob(data)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = generatePdfFilename(data)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
