'use client'

import { useState, useEffect } from 'react'
import { useAuth, usePremium } from '@/app/providers'
import { createClient } from '@/lib/supabase/client'
import { Task, UserSettings } from '@/types/app'
import TaskList from './TaskList'
import TaskInput from './TaskInput'
import CompletedTasksSection from './CompletedTasksSection'
import TaskStats from './TaskStats'
import EmptyState from './EmptyState'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'

interface TaskManagerProps {
  onTaskClick: (taskId: string) => void
  timerActive: boolean
}

export default function TaskManager({ onTaskClick, timerActive }: TaskManagerProps) {
  const { user } = useAuth()
  const { isPremium } = usePremium()
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [showTaskInput, setShowTaskInput] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<UserSettings>({
    autoHideCompleted: false,
    collapseCompleted: false,
    showConfetti: true,
    showStats: true,
    focusTime: 25,
    breakTime: 5,
  })
  
  const supabase = createClient()

  // Load tasks and settings on mount
  useEffect(() => {
    if (user) {
      loadTasks()
      loadSettings()
    }
  }, [user])

  const loadTasks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading tasks:', error)
        return
      }

      const activeTasks: Task[] = []
      const completed: Task[] = []

      data.forEach(task => {
        const taskData: Task = {
          id: task.id,
          text: task.text,
          completed: task.completed,
          completedAt: task.completed_at,
          totalWorkTime: task.total_work_time || 0,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
        }

        if (task.completed) {
          completed.push(taskData)
        } else {
          activeTasks.push(taskData)
        }
      })

      setTasks(activeTasks)
      setCompletedTasks(completed)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
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

  const addTask = async (text: string) => {
    if (!user || !text.trim()) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          text: text.trim(),
          completed: false,
          total_work_time: 0,
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding task:', error)
        return
      }

      const newTask: Task = {
        id: data.id,
        text: data.text,
        completed: false,
        totalWorkTime: 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      setTasks(prev => [...prev, newTask])
      setShowTaskInput(false)
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const completeTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)

      if (error) {
        console.error('Error completing task:', error)
        return
      }

      const task = tasks.find(t => t.id === taskId)
      if (task) {
        const completedTask = {
          ...task,
          completed: true,
          completedAt: new Date().toISOString(),
        }

        setTasks(prev => prev.filter(t => t.id !== taskId))
        setCompletedTasks(prev => [completedTask, ...prev])

        // Show confetti if enabled
        if (settings.showConfetti && isPremium) {
          showConfetti()
        }
      }
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const uncompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          completed: false,
          completed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)

      if (error) {
        console.error('Error uncompleting task:', error)
        return
      }

      const task = completedTasks.find(t => t.id === taskId)
      if (task) {
        const uncompletedTask = {
          ...task,
          completed: false,
          completedAt: undefined,
        }

        setCompletedTasks(prev => prev.filter(t => t.id !== taskId))
        setTasks(prev => [...prev, uncompletedTask])
      }
    } catch (error) {
      console.error('Error uncompleting task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) {
        console.error('Error deleting task:', error)
        return
      }

      setTasks(prev => prev.filter(t => t.id !== taskId))
      setCompletedTasks(prev => prev.filter(t => t.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const updateTaskWorkTime = async (taskId: string, additionalMinutes: number) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return

      const newTotalTime = task.totalWorkTime + additionalMinutes

      const { error } = await supabase
        .from('tasks')
        .update({
          total_work_time: newTotalTime,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)

      if (error) {
        console.error('Error updating task work time:', error)
        return
      }

      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, totalWorkTime: newTotalTime }
          : t
      ))
    } catch (error) {
      console.error('Error updating task work time:', error)
    }
  }

  const showConfetti = () => {
    // Create confetti particles
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div')
        confetti.className = 'confetti-particle'
        confetti.style.left = Math.random() * 100 + 'vw'
        confetti.style.backgroundColor = getRandomPastelColor()
        confetti.style.animationDelay = Math.random() * 0.5 + 's'
        
        document.body.appendChild(confetti)
        
        setTimeout(() => {
          confetti.remove()
        }, 1500)
      }, i * 50)
    }
  }

  const getRandomPastelColor = () => {
    const colors = ['#fef3c7', '#fce7f3', '#e0e7ff', '#dcfce7', '#fed7d7', '#ede9fe']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Task Stats */}
      {settings.showStats && (
        <TaskStats 
          tasks={tasks}
          completedTasks={completedTasks}
        />
      )}

      {/* Add Task Button */}
      <div className="flex justify-center">
        <Button
          variant="premium"
          size="lg"
          onClick={() => setShowTaskInput(true)}
          icon={<Plus size={20} />}
          className="rounded-full shadow-lg"
        >
          Add Task
        </Button>
      </div>

      {/* Task Input */}
      <TaskInput
        isVisible={showTaskInput}
        onSubmit={addTask}
        onCancel={() => setShowTaskInput(false)}
      />

      {/* Active Tasks */}
      {tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          onTaskClick={onTaskClick}
          onComplete={completeTask}
          onDelete={deleteTask}
          isPremium={isPremium}
        />
      ) : !showTaskInput && (
        <EmptyState onAddTask={() => setShowTaskInput(true)} />
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <CompletedTasksSection
          tasks={completedTasks}
          onUncomplete={uncompleteTask}
          onDelete={deleteTask}
          collapsed={settings.collapseCompleted}
        />
      )}
    </div>
  )
}