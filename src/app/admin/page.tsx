
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { pdf } from '@react-pdf/renderer'
import PdfDocument from '@/components/PdfDocument'
import Header from '@/components/Header'
import { Download, Loader2, Trash2, UserPlus, RefreshCw, Plus } from 'lucide-react'
import * as XLSX from 'xlsx'

interface Submission {
    id: string
    created_at: string
    name: string
    email: string
    content: string // JSON string
}

interface ParsedContent {
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

interface User {
    id: string
    email: string
    role: string
}

export default function AdminPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [generatingId, setGeneratingId] = useState<string | null>(null)

    // New User Form State
    const [newUserEmail, setNewUserEmail] = useState('')
    const [newUserPassword, setNewUserPassword] = useState('')
    const [newUserRole, setNewUserRole] = useState('user')
    const [creatingUser, setCreatingUser] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const stored = localStorage.getItem('form_app_user')
            if (!stored) {
                window.location.href = '/login'
                return
            }
            const user = JSON.parse(stored)
            if (user.role !== 'admin') {
                alert('Access Denied: Admins only')
                window.location.href = '/'
                return
            }
            fetchData()
        }
        checkAuth()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        await Promise.all([fetchSubmissions(), fetchUsers()])
        setLoading(false)
    }

    const fetchSubmissions = async () => {
        try {
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setSubmissions(data || [])
        } catch (error) {
            console.error('Error fetching submissions:', error)
        }
    }

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, email, role')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreatingUser(true)
        try {
            const { error } = await supabase
                .from('users')
                .insert([
                    {
                        email: newUserEmail,
                        password: newUserPassword,
                        role: newUserRole,
                    },
                ])

            if (error) throw error
            alert('User created successfully')
            setNewUserEmail('')
            setNewUserPassword('')
            fetchUsers()
        } catch (error: any) {
            alert('Error creating user: ' + error.message)
        } finally {
            setCreatingUser(false)
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return
        try {
            const { error } = await supabase.from('users').delete().eq('id', id)
            if (error) throw error
            fetchUsers()
        } catch (error: any) {
            alert('Error deleting user: ' + error.message)
        }
    }

    const handleDownloadPdf = async (submission: Submission) => {
        setGeneratingId(submission.id)
        try {
            let parsedData: ParsedContent
            try {
                parsedData = JSON.parse(submission.content)
            } catch (e) {
                // Fallback for old data or invalid JSON
                console.error('Error parsing JSON content', e)
                alert('Error: Invalid data format for this submission')
                setGeneratingId(null)
                return
            }

            const blob = await pdf(<PdfDocument data={parsedData} />).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `SPT-${parsedData.nomor_kontrak}-${parsedData.nama_customer.replace(/\s/g, '_')}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Error generating PDF')
        } finally {
            setGeneratingId(null)
        }
    }

    const parseContent = (content: string): ParsedContent | null => {
        try {
            return JSON.parse(content)
        } catch (e) {
            return null
        }
    }

    const handleDownloadExcel = () => {
        try {
            // Prepare data for Excel
            const excelData = submissions.map((submission, index) => {
                const parsed = parseContent(submission.content)
                if (parsed) {
                    return {
                        'No': index + 1,
                        'Nama Customer': parsed.nama_customer,
                        'Nomor Kontrak': parsed.nomor_kontrak,
                        'Nomor Langganan': parsed.nomor_langganan,
                        'Angsuran Ke': parsed.angsuran_ke,
                        'Nominal Angsuran': Number(parsed.nominal_angsuran),
                        'Tanggal Jatuh Tempo': parsed.tanggal_jatuh_tempo,
                        'Tanggal Maksimal Pembayaran': parsed.tanggal_maksimal_pembayaran,
                        'Tanggal Pembuatan SPT': parsed.tanggal_pembuatan_spt,
                        'Submitted At': new Date(submission.created_at).toLocaleString('id-ID')
                    }
                }
            })

            // Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(excelData)

            // Set column widths
            const columnWidths = [
                { wch: 5 },  // No
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
            worksheet['!cols'] = columnWidths

            // Create workbook
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions')

            // Generate filename with current date
            const now = new Date()
            const dateStr = now.toISOString().split('T')[0]
            const filename = `Form_Submissions_${dateStr}.xlsx`

            // Download file
            XLSX.writeFile(workbook, filename)
        } catch (error) {
            console.error('Error generating Excel:', error)
            alert('Error generating Excel file')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                    {/* Submissions Section */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Filled Forms</h1>
                                <p className="mt-1 text-sm text-gray-500">View and manage all form submissions.</p>
                            </div>

                            {/* button download Excel */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleDownloadExcel}
                                    className="inline-flex items-center rounded-xl text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-green-500 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    {/* Large screens text */}
                                    <span className="hidden sm:inline">Download Excel</span>

                                    {/* Small screens text */}
                                    <span className="sm:hidden">Excel</span>
                                </button>
                                <button
                                    onClick={fetchSubmissions}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <div className="bg-white shadow-xl shadow-gray-200 overflow-hidden sm:rounded-2xl border border-gray-100">
                            {loading ? (
                                <div className="p-12 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                </div>
                            ) : submissions.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">No submissions yet.</div>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {submissions.map((submission) => {
                                        const parsed = parseContent(submission.content)
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
                                                                onClick={() => handleDownloadPdf(submission)}
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
                                                                    <p><span className="font-medium">Nama ARHO:</span> <b>{parsed.nama_arho}</b></p>
                                                                    <p><span className="font-medium">Jatuh Tempo:</span> <b>{parsed.tanggal_jatuh_tempo}</b></p>
                                                                    <p><span className="font-medium">Nominal:</span> <b>Rp {Number(parsed.nominal_angsuran).toLocaleString('id-ID')}</b></p>
                                                                    <p><span className="font-medium">Angsuran Ke:</span> <b>{parsed.angsuran_ke}</b></p>
                                                                    <p><span className="font-medium">Maksimal Bayar:</span> <b>{parsed.tanggal_maksimal_pembayaran}</b></p>
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
                            )}
                        </div>
                    </section>

                </div>
            </main>
        </div>
    )
}
