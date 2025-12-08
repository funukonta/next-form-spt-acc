
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface UserSession {
    email: string
    role: string
}

export default function Header() {
    const [user, setUser] = useState<UserSession | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    const checkUser = () => {
        const stored = localStorage.getItem('form_app_user')
        if (stored) {
            setUser(JSON.parse(stored))
        } else {
            setUser(null)
        }
    }

    useEffect(() => {
        checkUser()
        window.addEventListener('storage', checkUser)
        return () => window.removeEventListener('storage', checkUser)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('form_app_user')
        setUser(null)
        window.dispatchEvent(new Event('storage'))
        router.push('/login')
    }

    const isAdmin = user?.role === 'admin'

    const isActive = (path: string) => pathname === path

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            {/* Optional: Add a small logo icon here if desired */}
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                                Form Surat Peringatan Terakhir
                            </span>
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link
                                href="/"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive('/')
                                    ? 'border-indigo-500 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                Form
                            </Link>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive('/admin')
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-900">{user.email}</span>
                                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
