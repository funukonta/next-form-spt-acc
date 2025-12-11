import { supabase } from '@/lib/supabase'
import { SPTFormData, Submission, ParsedContent } from '@/types'

/**
 * Submit form data to Supabase
 */
export const createSubmission = async (formData: SPTFormData): Promise<void> => {
  const { error } = await supabase.from('submissions').insert([
    {
      name: formData.nama_customer,
      email: 'system@form.com',
      content: JSON.stringify(formData),
    },
  ])

  if (error) throw error
}

/**
 * Fetch all submissions from Supabase
 */
export const fetchSubmissions = async (): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Parse submission content JSON to ParsedContent
 */
export const parseSubmissionContent = (content: string): ParsedContent | null => {
  try {
    return JSON.parse(content)
  } catch (e) {
    console.error('Error parsing submission content:', e)
    return null
  }
}

/**
 * Delete a submission by ID
 */
export const deleteSubmission = async (id: string): Promise<void> => {
  const { error } = await supabase.from('submissions').delete().eq('id', id)
  if (error) throw error
}
