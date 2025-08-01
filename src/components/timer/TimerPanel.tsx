'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase/client'
import { Task, TimerState, UserSettings } from '@/types/app'
import { Play, Pause, RotateCcw, X, Settings } from 'lucide-react'
import Button from '@/components/ui/Button'

interface TimerPanelProps {
  taskId: string
  onClose: () => void
}

export default function TimerPanel({ taskId, onClose }: TimerPanelProps) {
  const { user } = useAuth()
  const [task, setTask] = useState<Task | null>(null)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [timeRemaining, setTimeRemaining] = useState(25 * 60) // 25 minutes in seconds
  const [totalTime, setTotalTime] = useState(25 * 60)
  const [settings, setSettings] = useState<UserSettings>({
    autoHideCompleted: false,
    collapseCompleted: false,
    showConfetti: true,
    showStats: true,
    focusTime: 25,
    breakTime: 5,
  })
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  // Load task and settings
  useEffect(() => {
    if (user && taskId) {
      loadTask()
      loadSettings()
    }
  }, [user, taskId])

  // Update timer when settings change
  useEffect(() => {
    if (timerState === 'idle') {
      const newTime = settings.focusTime * 60
      setTimeRemaining(newTime)
      setTotalTime(newTime)
    }
  }, [settings.focusTime, timerState])

  // Timer countdown effect
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState])

  const loadTask = async () => {
    if (!user || !taskId) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error loading task:', error)
        return
      }

      setTask({
        id: data.id,
        text: data.text,
        completed: data.completed,
        completedAt: data.completed_at,
        totalWorkTime: data.total_work_time || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      })
    } catch (error) {
      console.error('Error loading task:', error)
    }
  }

  const loadSettings = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
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

  const handleTimerComplete = async () => {
    setTimerState('completed')
    
    // Update task work time
    if (task) {
      const focusMinutes = Math.round((totalTime - timeRemaining) / 60)
      await updateTaskWorkTime(focusMinutes)
    }

    // Show completion notification
    showCompletionNotification()
  }

  const updateTaskWorkTime = async (additionalMinutes: number) => {
    if (!task || !user) return

    try {
      const newTotalTime = task.totalWorkTime + additionalMinutes

      const { error } = await supabase
        .from('tasks')
        .update({
          total_work_time: newTotalTime,
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id)

      if (error) {
        console.error('Error updating task work time:', error)
        return
      }

      setTask(prev => prev ? { ...prev, totalWorkTime: newTotalTime } : null)
    } catch (error) {
      console.error('Error updating task work time:', error)
    }
  }

  const showCompletionNotification = () => {
    // Create a simple notification
    const notification = document.createElement('div')
    notification.innerHTML = '🎉 Focus session completed!'
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  const startTimer = () => {
    setTimerState('running')
  }

  const pauseTimer = () => {
    setTimerState('paused')
  }

  const resetTimer = () => {
    setTimerState('idle')
    const newTime = settings.focusTime * 60
    setTimeRemaining(newTime)
    setTotalTime(newTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return ((totalTime - timeRemaining) / totalTime) * 100
  }

  if (!task) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 w-full md:w-96 h-full bg-secondary border-l border-gray-700 shadow-2xl z-40 overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold premium-text-gradient">
              ○ Focus Timer
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<X size={20} />}
            >
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Current Task */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="font-semibold text-text-primary mb-2">Current Task</h3>
            <p className="text-text-secondary">{task.text}</p>
            <p className="text-sm text-text-muted mt-2">
              Status: {timerState === 'idle' ? 'Ready to focus' : 
                      timerState === 'running' ? 'Focusing now...' : 
                      timerState === 'paused' ? 'Paused' : 'Completed'}
            </p>
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center space-y-6">
            
            {/* Circular Progress */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="url(#timerGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgressPercentage() / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="25%" stopColor="#fce7f3" />
                    <stop offset="50%" stopColor="#e0e7ff" />
                    <stop offset="75%" stopColor="#dcfce7" />
                    <stop offset="100%" stopColor="#fed7d7" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Timer text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-text-primary">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-4">
              {timerState === 'idle' || timerState === 'paused' ? (
                <Button
                  variant="premium"
                  size="lg"
                  onClick={startTimer}
                  icon={<Play size={20} />}
                  className="rounded-full w-16 h-16"
                >
                  <span className="sr-only">Start</span>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={pauseTimer}
                  icon={<Pause size={20} />}
                  className="rounded-full w-16 h-16"
                >
                  <span className="sr-only">Pause</span>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="lg"
                onClick={resetTimer}
                icon={<RotateCcw size={20} />}
                className="rounded-full w-16 h-16"
              >
                <span className="sr-only">Reset</span>
              </Button>
            </div>
          </div>

          {/* Timer Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary">Timer Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Focus Time (min)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.focusTime}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    focusTime: parseInt(e.target.value) || 25 
                  }))}
                  className="input-premium w-full rounded-lg px-3 py-2 text-sm"
                  disabled={timerState !== 'idle'}
                />
              </div>
              
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Break Time (min)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.breakTime}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    breakTime: parseInt(e.target.value) || 5 
                  }))}
                  className="input-premium w-full rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Task Work Time */}
          {task.totalWorkTime > 0 && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <h4 className="text-sm font-medium text-purple-400 mb-1">Total Work Time</h4>
              <p className="text-2xl font-bold text-purple-300">
                {Math.floor(task.totalWorkTime / 60)}h {task.totalWorkTime % 60}m
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}