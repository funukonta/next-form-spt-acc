'use client'

import { useSPTForm } from '@/hooks'
import { ARHO_OPTIONS } from '@/constants'
import {
  FormInput,
  FormSelect,
  FormCurrencyInput,
  FormDateInput,
  SubmitButton,
} from '@/components/ui'

export const SPTForm = () => {
  const {
    formData,
    loading,
    handleChange,
    handleNominalChange,
    setTodayDate,
    submitForm,
  } = useSPTForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submitForm()
      alert('Form submitted and PDF downloaded!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert('Error submitting form: ' + message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <FormSelect
            label="Nama ARHO"
            name="nama_arho"
            value={formData.nama_arho}
            onChange={handleChange}
            options={ARHO_OPTIONS}
            required
            placeholder="Select ARHO..."
          />

          <FormInput
            label="Nama Customer"
            name="nama_customer"
            value={formData.nama_customer}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Nomor Kontrak"
            name="nomor_kontrak"
            value={formData.nomor_kontrak}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Nomor Langganan"
            name="nomor_langganan"
            value={formData.nomor_langganan}
            onChange={handleChange}
            required
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <FormInput
            label="Angsuran Ke-"
            name="angsuran_ke"
            value={formData.angsuran_ke}
            onChange={handleChange}
            type="number"
            required
          />

          <FormCurrencyInput
            label="Nominal"
            name="nominal_angsuran"
            value={formData.nominal_angsuran}
            onChange={handleNominalChange}
            required
          />

          <FormDateInput
            label="Tanggal Jatuh Tempo"
            name="tanggal_jatuh_tempo"
            value={formData.tanggal_jatuh_tempo}
            onChange={handleChange}
            required
          />

          <FormDateInput
            label="Tanggal Maksimal Pembayaran"
            name="tanggal_maksimal_pembayaran"
            value={formData.tanggal_maksimal_pembayaran}
            onChange={handleChange}
            required
          />

          <FormDateInput
            label="Tanggal Pembuatan SPT"
            name="tanggal_pembuatan_spt"
            value={formData.tanggal_pembuatan_spt}
            onChange={handleChange}
            required
            showTodayButton
            onTodayClick={setTodayDate}
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <SubmitButton loading={loading} loadingText="Generating PDF...">
          Generate SPT PDF
        </SubmitButton>
      </div>
    </form>
  )
}
