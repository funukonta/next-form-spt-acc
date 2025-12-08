
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { pdf } from '@react-pdf/renderer'
import PdfDocument from '@/components/PdfDocument'
import Header from '@/components/Header'
import { Download, Loader2, Trash2, UserPlus, RefreshCw, Plus } from 'lucide-react'

interface Submission {
    id: string
    created_at: string
    name: string
    email: string
    content: string // JSON string
}

interface ParsedContent {
    nama_customer: string
    nama_armh: string
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
                            <button
                                onClick={fetchSubmissions}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </button>
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
                                                                    <p><span className="font-medium">Jatuh Tempo:</span> {parsed.tanggal_jatuh_tempo}</p>
                                                                    <p><span className="font-medium">Nominal:</span> Rp {Number(parsed.nominal_angsuran).toLocaleString('id-ID')}</p>
                                                                    <p><span className="font-medium">Angsuran Ke:</span> {parsed.angsuran_ke}</p>
                                                                    <p><span className="font-medium">Maksimal Bayar:</span> {parsed.tanggal_maksimal_pembayaran}</p>
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

                    {/* User Management Section */}
                    <section>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h2>
                            <p className="mt-1 text-sm text-gray-500">Manage system access and roles.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Create User Form */}
                            <div className="bg-white shadow-xl shadow-gray-200 sm:rounded-2xl p-8 border border-gray-100 h-fit">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                    <UserPlus className="h-5 w-5 mr-2 text-indigo-600" />
                                    Create New User
                                </h3>
                                <form onSubmit={handleCreateUser} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={newUserEmail}
                                            onChange={(e) => setNewUserEmail(e.target.value)}
                                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                            placeholder="newuser@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="text"
                                            required
                                            value={newUserPassword}
                                            onChange={(e) => setNewUserPassword(e.target.value)}
                                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200"
                                            placeholder="Secure password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <div className="mt-1 relative">
                                            <select
                                                value={newUserRole}
                                                onChange={(e) => setNewUserRole(e.target.value)}
                                                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm appearance-none bg-white transition-all duration-200"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={creatingUser}
                                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        {creatingUser ? 'Creating...' : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create User
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* User List */}
                            <div className="bg-white shadow-xl shadow-gray-200 sm:rounded-2xl overflow-hidden border border-gray-100 flex flex-col h-[500px]">
                                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="text-lg font-semibold text-gray-900">Existing Users</h3>
                                </div>
                                <div className="overflow-y-auto flex-1 p-2">
                                    <ul className="space-y-2">
                                        {users.map((user) => (
                                            <li key={user.id} className="px-4 py-3 rounded-xl hover:bg-gray-50 flex items-center justify-between group transition-colors duration-200 border border-transparent hover:border-gray-100">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        <span className="text-sm font-bold uppercase">{user.email[0]}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    )
}
