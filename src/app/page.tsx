'use client'

import Header from '@/components/Header'
import { SPTForm } from '@/components/forms'

export default function Home() {
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
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Form Surat Peringatan Terakhir
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Lengkapi data berikut untuk membuat Surat Peringatan Terakhir (SPT).
                </p>
              </div>

              <SPTForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
