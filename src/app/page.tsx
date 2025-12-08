
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { pdf } from '@react-pdf/renderer'
import PdfDocument from '@/components/PdfDocument'
import Header from '@/components/Header'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nama_arho: '',
    nama_customer: '',
    nama_armh: '',
    nomor_kontrak: '',
    nomor_langganan: '',
    angsuran_ke: '',
    nominal_angsuran: '',
    tanggal_jatuh_tempo: '',
    tanggal_maksimal_pembayaran: '',
    tanggal_pembuatan_spt: '',
  })

  // Set default date for "Tanggal Pembuatan SPT" to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, tanggal_pembuatan_spt: today }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Save to Supabase
      // We store the main identifier in 'name' and the full data object in 'content'
      const { error } = await supabase
        .from('submissions')
        .insert([
          {
            name: formData.nama_customer,
            email: 'system@form.com', // Placeholder since we don't ask for email anymore
            content: JSON.stringify(formData),
          },
        ])

      if (error) throw error

      // 2. Generate and Download PDF
      const blob = await pdf(<PdfDocument data={formData} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `SPT-${formData.nomor_kontrak}-${formData.nama_customer.replace(/\s/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert('Form submitted and PDF downloaded!')
      // Reset form (optional, maybe keep some fields?)
      setFormData({
        nama_arho: '',
        nama_customer: '',
        nama_armh: '',
        nomor_kontrak: '',
        nomor_langganan: '',
        angsuran_ke: '',
        nominal_angsuran: '',
        tanggal_jatuh_tempo: '',
        tanggal_maksimal_pembayaran: '',
        tanggal_pembuatan_spt: new Date().toISOString().split('T')[0],
      })
    } catch (error: any) {
      console.error('Error:', error)
      alert('Error submitting form: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 relative isolate">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src="/logo_acc.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-20 blur-[2px]"
        />
      </div>

      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl shadow-gray-200 sm:rounded-2xl border border-gray-100">
            <div className="px-4 py-8 sm:p-10">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Form Surat Peringatan Terakhir</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Lengkapi data berikut untuk membuat Surat Peringatan Terakhir (SPT).
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">

                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="nama_arho" className="block text-sm font-medium text-gray-700">
                        Nama ARHO <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama_arho"
                        id="nama_arho"
                        required
                        value={formData.nama_arho}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="nama_customer" className="block text-sm font-medium text-gray-700">
                        Nama Customer <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama_customer"
                        id="nama_customer"
                        required
                        value={formData.nama_customer}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="nama_armh" className="block text-sm font-medium text-gray-700">
                        Nama ARMH
                      </label>
                      <input
                        type="text"
                        name="nama_armh"
                        id="nama_armh"
                        value={formData.nama_armh}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="nomor_kontrak" className="block text-sm font-medium text-gray-700">
                        Nomor Kontrak <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nomor_kontrak"
                        id="nomor_kontrak"
                        required
                        value={formData.nomor_kontrak}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="nomor_langganan" className="block text-sm font-medium text-gray-700">
                        Nomor Langganan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nomor_langganan"
                        id="nomor_langganan"
                        required
                        value={formData.nomor_langganan}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                      />
                    </div>

                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="angsuran_ke" className="block text-sm font-medium text-gray-700">
                        Angsuran Ke- <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="angsuran_ke"
                        id="angsuran_ke"
                        required
                        value={formData.angsuran_ke}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="nominal_angsuran" className="block text-sm font-medium text-gray-700">
                        Nominal <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">Rp</span>
                        </div>
                        <input
                          type="text"
                          name="nominal_angsuran"
                          id="nominal_angsuran"
                          required
                          value={formData.nominal_angsuran ? Number(formData.nominal_angsuran).toLocaleString('id-ID') : ''}
                          onChange={(e) => {
                            // Remove non-digit characters to get raw number
                            const rawValue = e.target.value.replace(/\D/g, '')
                            setFormData({ ...formData, nominal_angsuran: rawValue })
                          }}
                          className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tanggal_jatuh_tempo" className="block text-sm font-medium text-gray-700">
                        Tanggal Jatuh Tempo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggal_jatuh_tempo"
                        id="tanggal_jatuh_tempo"
                        required
                        value={formData.tanggal_jatuh_tempo}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="tanggal_maksimal_pembayaran" className="block text-sm font-medium text-gray-700">
                        Tanggal Maksimal Pembayaran <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggal_maksimal_pembayaran"
                        id="tanggal_maksimal_pembayaran"
                        required
                        value={formData.tanggal_maksimal_pembayaran}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <label htmlFor="tanggal_pembuatan_spt" className="block text-sm font-medium text-gray-700">
                          Tanggal Pembuatan SPT <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Date().toISOString().split('T')[0]
                            setFormData(prev => ({ ...prev, tanggal_pembuatan_spt: today }))
                          }}
                          className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                        >
                          Click for Today
                        </button>
                      </div>
                      <input
                        type="date"
                        name="tanggal_pembuatan_spt"
                        id="tanggal_pembuatan_spt"
                        required
                        value={formData.tanggal_pembuatan_spt}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                      />
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating PDF...
                      </span>
                    ) : (
                      'Generate SPT PDF'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
