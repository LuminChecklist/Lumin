'use client'

import { useEffect } from 'react'
import { useAuth, usePremium } from '@/app/providers'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { loadStripe } from '@stripe/stripe-js'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { user } = useAuth()
  const { checkPremiumStatus } = usePremium()

  const features = [
    { icon: '🌈', text: 'Pastel rainbow gradients' },
    { icon: '✨', text: 'Confetti & glow rewards' },
    { icon: '🌀', text: 'Smooth hover animations' },
    { icon: '🎯', text: 'Psychology-powered completion' },
    { icon: '⏱️', text: 'Focus timer (Pomodoro)' },
    { icon: '🎵', text: 'Sounds (coming soon)' },
  ]

  const handleUpgrade = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  // Check for successful payment on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    
    if (success === 'true') {
      // Payment was successful, refresh premium status
      checkPremiumStatus()
      onClose()
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [checkPremiumStatus, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
      <div className="text-center space-y-6">
        
        {/* Price */}
        <div className="premium-text-gradient text-6xl font-black">
          $0.99
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-text-primary">
          Turn your tasks into dopamine
        </h2>
        
        <p className="text-text-secondary">
          Experience the full dopamine-powered productivity journey
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 my-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <span className="text-xl">{feature.icon}</span>
              <span className="text-text-primary text-sm font-medium">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="text-center space-y-2">
          <div className="text-text-primary font-semibold">
            One-time unlock. No subscriptions.
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            variant="premium"
            size="lg"
            fullWidth
            onClick={handleUpgrade}
            className="relative overflow-hidden"
          >
            <span className="relative z-10">Upgrade to Lumin+</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-80" />
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary"
          >
            Maybe Later
          </Button>
        </div>

        {/* Security Badge */}
        <div className="text-xs text-text-muted">
          Secured by Stripe
        </div>

      </div>
    </Modal>
  )
}