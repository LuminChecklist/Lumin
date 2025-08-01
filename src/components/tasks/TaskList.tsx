'use client'

import { Task } from '@/types/app'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onComplete: (taskId: string) => void
  onDelete: (taskId: string) => void
  isPremium: boolean
}

export default function TaskList({ 
  tasks, 
  onTaskClick, 
  onComplete, 
  onDelete, 
  isPremium 
}: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onTaskClick={() => onTaskClick(task.id)}
          onComplete={() => onComplete(task.id)}
          onDelete={() => onDelete(task.id)}
          isPremium={isPremium}
        />
      ))}
    </div>
  )
}