'use client'

import { useEffect, useState } from 'react'
import { useAuth, usePremium } from './providers'
import AuthModal from '@/components/auth/AuthModal'
import TaskManager from '@/components/tasks/TaskManager'
import TimerPanel from '@/components/timer/TimerPanel'
import UpgradeBanner from '@/components/premium/UpgradeBanner'
import PremiumModal from '@/components/premium/PremiumModal'
import Header from '@/components/layout/Header'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const { isPremium, loading: premiumLoading } = usePremium()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  // Show auth modal if user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true)
    } else {
      setShowAuthModal(false)
    }
  }, [user, authLoading])

  // Set premium status on body for CSS
  useEffect(() => {
    if (!premiumLoading) {
      document.body.setAttribute('data-premium', isPremium.toString())
    }
  }, [isPremium, premiumLoading])

  const handleTaskClick = (taskId: string) => {
    if (!isPremium) {
      setShowPremiumModal(true)
      return
    }
    
    setSelectedTask(taskId)
    setTimerActive(true)
  }

  const handleCloseTimer = () => {
    setTimerActive(false)
    setSelectedTask(null)
  }

  const handleUpgradeClick = () => {
    setShowPremiumModal(true)
  }

  // Show loading spinner while checking auth and premium status
  if (authLoading || premiumLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className={`max-w-2xl mx-auto transition-all duration-700 ${
        timerActive ? 'md:translate-x-[-50%] md:max-w-[50vw]' : ''
      }`}>
        
        {/* Header */}
        <Header onUpgradeClick={handleUpgradeClick} />
        
        {/* Upgrade Banner (free users only) */}
        {user && !isPremium && (
          <UpgradeBanner onUpgradeClick={handleUpgradeClick} />
        )}
        
        {/* Main Task Manager */}
        {user && (
          <TaskManager 
            onTaskClick={handleTaskClick}
            timerActive={timerActive}
          />
        )}
      </div>

      {/* Timer Panel */}
      {user && timerActive && selectedTask && (
        <TimerPanel
          taskId={selectedTask}
          onClose={handleCloseTimer}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Premium Upgrade Modal */}
      <PremiumModal 
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </main>
  )
}