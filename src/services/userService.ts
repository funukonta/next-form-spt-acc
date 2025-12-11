import { supabase } from '@/lib/supabase'
import { User, UserSession } from '@/types'
import { STORAGE_KEYS } from '@/constants'

/**
 * Authenticate user with email and password
 */
export const authenticateUser = async (
  email: string,
  password: string
): Promise<UserSession> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !data) {
    throw new Error('Invalid email or password')
  }

  if (data.password !== password) {
    throw new Error('Invalid email or password')
  }

  return {
    email: data.email,
    role: data.role,
  }
}

/**
 * Fetch all users from Supabase
 */
export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Create a new user
 */
export const createUser = async (
  email: string,
  password: string,
  role: string
): Promise<void> => {
  const { error } = await supabase.from('users').insert([
    {
      email,
      password,
      role,
    },
  ])

  if (error) throw error
}

/**
 * Delete a user by ID
 */
export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
}

/**
 * Save user session to localStorage
 */
export const saveUserSession = (session: UserSession): void => {
  localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session))
  window.dispatchEvent(new Event('storage'))
}

/**
 * Get user session from localStorage
 */
export const getUserSession = (): UserSession | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_SESSION)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

/**
 * Clear user session from localStorage
 */
export const clearUserSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_SESSION)
  window.dispatchEvent(new Event('storage'))
}
