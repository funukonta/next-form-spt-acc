// Form Data Types
export interface SPTFormData {
  nama_arho: string
  nama_customer: string
  nomor_kontrak: string
  nomor_langganan: string
  angsuran_ke: string
  nominal_angsuran: string
  tanggal_jatuh_tempo: string
  tanggal_maksimal_pembayaran: string
  tanggal_pembuatan_spt: string
}

// Database Types
export interface Submission {
  id: string
  created_at: string
  name: string
  email: string
  content: string // JSON string of SPTFormData
}

export interface User {
  id: string
  email: string
  password?: string
  role: 'admin' | 'user'
  created_at?: string
}

// Session Types
export interface UserSession {
  email: string
  role: 'admin' | 'user'
}

// Parsed Content (same as SPTFormData but used when parsing from DB)
export type ParsedContent = SPTFormData
