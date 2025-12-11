// ARHO Options
export const ARHO_OPTIONS = [
  'FRANS',
  'MASTUR',
  'SAIFUDDIN',
  'EKO',
  'SATRIA',
  'AAN',
  'ALI RHEDA',
  'GERALDI',
  'NURUDDIN',
  'FAWZI',
  'RIFQI',
  'RYAN',
  'AMMAR',
  'RUDI',
  'TANDI',
] as const

export type ArhoOption = (typeof ARHO_OPTIONS)[number]

// Initial Form State
export const INITIAL_FORM_STATE = {
  nama_arho: '',
  nama_customer: '',
  nomor_kontrak: '',
  nomor_langganan: '',
  angsuran_ke: '',
  nominal_angsuran: '',
  tanggal_jatuh_tempo: '',
  tanggal_maksimal_pembayaran: '',
  tanggal_pembuatan_spt: '',
}

// Storage Keys
export const STORAGE_KEYS = {
  USER_SESSION: 'form_app_user',
} as const
