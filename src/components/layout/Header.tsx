'use client'

import { useState } from 'react'
import { Settings, Moon } from 'lucide-react'
import { useAuth } from '@/app/providers'
import SettingsModal from './SettingsModal'
import Button from '@/components/ui/Button'

interface HeaderProps {
  onUpgradeClick: () => void
}

export default function Header({ onUpgradeClick }: HeaderProps) {
  const { user } = useAuth()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        {/* Logo */}
        <h1 className="text-3xl md:text-4xl font-bold premium-text-gradient">
          Lumin
        </h1>

        {/* Controls */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              icon={<Settings size={20} />}
              className="w-12 h-12 rounded-full"
            >
              <span className="sr-only">Settings</span>
            </Button>

            {/* Theme Toggle (always shows half-filled circle) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {/* Theme is always dark in this version */}}
              className="w-12 h-12 rounded-full text-xl"
            >
              ◐
            </Button>
          </div>
        )}
      </header>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  )
}