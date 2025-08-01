'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

// Auth Context
interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Premium Context
interface PremiumContextType {
  isPremium: boolean
  loading: boolean
  checkPremiumStatus: () => Promise<void>
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

export function usePremium() {
  const context = useContext(PremiumContext)
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider')
  }
  return context
}

// Auth Provider
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Premium Provider
function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  const checkPremiumStatus = async () => {
    if (!user) {
      setIsPremium(false)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('is_lumin_plus')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error checking premium status:', error)
        setIsPremium(false)
      } else {
        setIsPremium(data?.is_lumin_plus || false)
      }
    } catch (error) {
      console.error('Error checking premium status:', error)
      setIsPremium(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkPremiumStatus()
  }, [user])

  const value = {
    isPremium,
    loading,
    checkPremiumStatus,
  }

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
}

// Combined Providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PremiumProvider>
        {children}
      </PremiumProvider>
    </AuthProvider>
  )
}