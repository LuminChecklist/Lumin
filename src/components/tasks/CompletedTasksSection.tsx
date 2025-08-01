'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '@/types/app'
import { ChevronDown, ChevronRight, RotateCcw, X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface CompletedTasksSectionProps {
  tasks: Task[]
  onUncomplete: (taskId: string) => void
  onDelete: (taskId: string) => void
  collapsed: boolean
}

export default function CompletedTasksSection({ 
  tasks, 
  onUncomplete, 
  onDelete, 
  collapsed: initialCollapsed 
}: CompletedTasksSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)

  if (tasks.length === 0) return null

  return (
    <div className="mt-8">
      
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between w-full p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors group"
      >
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            <ChevronRight size={20} className="text-text-muted group-hover:text-text-secondary transition-colors" />
          ) : (
            <ChevronDown size={20} className="text-text-muted group-hover:text-text-secondary transition-colors" />
          )}
          
          <span className="text-text-secondary font-medium">
            ✓ Completed
          </span>
          
          <span className="text-text-muted text-sm">
            ({tasks.length})
          </span>
        </div>
      </button>

      {/* Completed Tasks List */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2">
              {tasks.map((task, index) => (
                <CompletedTaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onUncomplete={() => onUncomplete(task.id)}
                  onDelete={() => onDelete(task.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface CompletedTaskItemProps {
  task: Task
  index: number
  onUncomplete: () => void
  onDelete: () => void
}

function CompletedTaskItem({ task, index, onUncomplete, onDelete }: CompletedTaskItemProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleUncomplete = () => {
    setIsAnimating(true)
    setTimeout(onUncomplete, 300)
  }

  const handleDelete = () => {
    setIsAnimating(true)
    setTimeout(onDelete, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1, 
        x: isAnimating ? -20 : 0 
      }}
      transition={{ delay: index * 0.05 }}
      className="group flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
    >
      
      {/* Task Text */}
      <div className="flex-1 min-w-0">
        <p className="text-text-muted line-through truncate">
          {task.text}
        </p>
        {task.completedAt && (
          <p className="text-xs text-text-muted mt-1">
            Completed {new Date(task.completedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUncomplete}
          icon={<RotateCcw size={14} />}
          className="opacity-0 group-hover:opacity-100 hover:bg-blue-500/20 hover:text-blue-400 transition-all"
        >
          <span className="sr-only">Undo</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          icon={<X size={14} />}
          className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </motion.div>
  )
}