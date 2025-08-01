'use client'

import { Task } from '@/types/app'
import { BarChart3, Target, Clock, Zap } from 'lucide-react'

interface TaskStatsProps {
  tasks: Task[]
  completedTasks: Task[]
}

export default function TaskStats({ tasks, completedTasks }: TaskStatsProps) {
  const totalTasks = tasks.length + completedTasks.length
  const totalCompleted = completedTasks.length
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0
  
  // Calculate today's completed tasks
  const today = new Date().toDateString()
  const todayCompleted = completedTasks.filter(task => 
    task.completedAt && new Date(task.completedAt).toDateString() === today
  ).length

  // Calculate total focus time
  const totalFocusTime = [...tasks, ...completedTasks]
    .reduce((total, task) => total + (task.totalWorkTime || 0), 0)

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const stats = [
    {
      icon: Target,
      label: 'Completion Rate',
      value: `${completionRate}%`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      icon: Zap,
      label: 'Today Completed',
      value: todayCompleted.toString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: BarChart3,
      label: 'Total Tasks',
      value: totalTasks.toString(),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      icon: Clock,
      label: 'Focus Time',
      value: formatTime(totalFocusTime),
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
  ]

  if (totalTasks === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            
            <div className="min-w-0 flex-1">
              <p className="text-text-muted text-xs uppercase tracking-wide">
                {stat.label}
              </p>
              <p className={`font-bold text-lg ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}