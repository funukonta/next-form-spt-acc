
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  const closeMobileMenu = () => setMobileMenuOpen(false)

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
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-900">{user.email}</span>
                                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="hidden sm:inline-flex items-center justify-center rounded-lg border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-200"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`sm:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 bg-white">
                    {user && (
                        <div className="px-3 py-2 border-b border-gray-200 mb-2">
                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                    )}
                    <Link
                        href="/"
                        onClick={closeMobileMenu}
                        className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${isActive('/')
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        Form
                    </Link>
                    {isAdmin && (
                        <Link
                            href="/admin"
                            onClick={closeMobileMenu}
                            className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${isActive('/admin')
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            Admin Dashboard
                        </Link>
                    )}

                    {/* Login/Logout in mobile menu */}
                    <div className="pt-2 border-t border-gray-200">
                        {user ? (
                            <button
                                onClick={() => {
                                    logout()
                                    closeMobileMenu()
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={closeMobileMenu}
                                className="block px-3 py-2 rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-center"
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
