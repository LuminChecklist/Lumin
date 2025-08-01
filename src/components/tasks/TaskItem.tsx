'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '@/types/app'
import { Check, X, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'

interface TaskItemProps {
  task: Task
  index: number
  onTaskClick: () => void
  onComplete: () => void
  onDelete: () => void
  isPremium: boolean
}

export default function TaskItem({ 
  task, 
  index, 
  onTaskClick, 
  onComplete, 
  onDelete, 
  isPremium 
}: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    setTimeout(() => {
      onComplete()
    }, 400) // Match animation duration
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setTimeout(() => {
      onDelete()
    }, 400) // Match animation duration
  }

  const formatWorkTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      if (remainingMinutes === 0) {
        return `${hours}h`
      } else {
        return `${hours}h ${remainingMinutes}m`
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: isCompleting || isDeleting ? 0 : 1,
        y: isCompleting ? -50 : isDeleting ? 0 : 0,
        x: isDeleting ? -50 : 0,
        scale: isCompleting || isDeleting ? 0.9 : 1,
      }}
      transition={{ 
        type: 'spring', 
        duration: 0.6,
        delay: index * 0.1 
      }}
      className={`
        group p-4 rounded-xl border transition-all duration-300 cursor-pointer
        ${isPremium 
          ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/25' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
        }
        ${isCompleting ? 'completing' : ''}
        ${isDeleting ? 'deleting' : ''}
      `}
      onClick={onTaskClick}
    >
      <div className="flex items-center justify-between">
        
        {/* Task Text */}
        <div className="flex-1 min-w-0">
          <p className="text-text-primary font-medium truncate group-hover:text-white transition-colors">
            {task.text}
          </p>
          
          {/* Work Time */}
          {task.totalWorkTime > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Clock size={14} className="text-text-muted" />
              <span className="text-sm text-text-muted">
                {formatWorkTime(task.totalWorkTime)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleComplete()
            }}
            icon={<Check size={16} />}
            className="opacity-0 group-hover:opacity-100 hover:bg-green-500/20 hover:text-green-400 transition-all"
          >
            <span className="sr-only">Complete</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            icon={<X size={16} />}
            className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      {/* Premium Hover Effect */}
      {isPremium && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300 pointer-events-none" />
      )}
    </motion.div>
  )
}