'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { UserSession } from '@/types'
import { getUserSession, clearUserSession } from '@/services/userService'

export const useAuth = () => {
  const [user, setUser] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = () => {
      const session = getUserSession()
      setUser(session)
      setIsLoading(false)
    }
    
    checkUser()
    window.addEventListener('storage', checkUser)
    return () => window.removeEventListener('storage', checkUser)
  }, [])

  const logout = useCallback(() => {
    clearUserSession()
    setUser(null)
    router.push('/login')
  }, [router])

  const isAdmin = user?.role === 'admin'
  const isAuthenticated = !!user

  return {
    user,
    isLoading,
    isAdmin,
    isAuthenticated,
    logout,
  }
}
