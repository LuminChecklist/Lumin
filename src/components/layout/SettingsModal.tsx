'use client'

import { useState, useEffect } from 'react'
import { useAuth, usePremium } from '@/app/providers'
import { createClient } from '@/lib/supabase/client'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { UserSettings } from '@/types/app'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuth()
  const { isPremium } = usePremium()
  const [settings, setSettings] = useState<UserSettings>({
    autoHideCompleted: false,
    collapseCompleted: false,
    showConfetti: true,
    showStats: true,
    focusTime: 25,
    breakTime: 5,
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Load user settings
  useEffect(() => {
    if (user && isOpen) {
      loadSettings()
    }
  }, [user, isOpen])

  const loadSettings = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error loading settings:', error)
        return
      }

      if (data) {
        setSettings({
          autoHideCompleted: data.auto_hide_completed,
          collapseCompleted: data.collapse_completed,
          showConfetti: data.show_confetti,
          showStats: data.show_stats,
          focusTime: data.focus_time,
          breakTime: data.break_time,
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const saveSettings = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          auto_hide_completed: settings.autoHideCompleted,
          collapse_completed: settings.collapseCompleted,
          show_confetti: settings.showConfetti,
          show_stats: settings.showStats,
          focus_time: settings.focusTime,
          break_time: settings.breakTime,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Error saving settings:', error)
        return
      }

      onClose()
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="md">
      <div className="space-y-6">
        
        {/* General Settings */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">General</h3>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-text-primary font-medium">Auto-hide completed tasks</label>
                <p className="text-sm text-text-muted">Hide completed tasks after some time</p>
              </div>
              <button
                onClick={() => updateSetting('autoHideCompleted', !settings.autoHideCompleted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoHideCompleted ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoHideCompleted ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-text-primary font-medium">Collapse completed section</label>
                <p className="text-sm text-text-muted">Start with completed tasks collapsed</p>
              </div>
              <button
                onClick={() => updateSetting('collapseCompleted', !settings.collapseCompleted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.collapseCompleted ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.collapseCompleted ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-text-primary font-medium">Show confetti</label>
                <p className="text-sm text-text-muted">Celebrate task completions with confetti</p>
              </div>
              <button
                onClick={() => updateSetting('showConfetti', !settings.showConfetti)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showConfetti ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showConfetti ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-text-primary font-medium">Show statistics</label>
                <p className="text-sm text-text-muted">Display completion stats</p>
              </div>
              <button
                onClick={() => updateSetting('showStats', !settings.showStats)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showStats ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showStats ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Timer Settings */}
        {isPremium && (
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Timer (Lumin+)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-text-primary font-medium mb-2">
                  Focus time (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.focusTime}
                  onChange={(e) => updateSetting('focusTime', parseInt(e.target.value) || 25)}
                  className="input-premium w-full rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium mb-2">
                  Break time (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.breakTime}
                  onChange={(e) => updateSetting('breakTime', parseInt(e.target.value) || 5)}
                  className="input-premium w-full rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-700">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button variant="premium" onClick={saveSettings} loading={loading} fullWidth>
            Save Settings
          </Button>
        </div>
      </div>
    </Modal>
  )
}