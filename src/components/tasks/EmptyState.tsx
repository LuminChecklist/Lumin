'use client'

import { motion } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'

interface EmptyStateProps {
  onAddTask: () => void
}

export default function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center py-16 px-6"
    >
      
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center">
          <Sparkles size={32} className="text-purple-400" />
        </div>
        
        {/* Floating animation */}
        <motion.div
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-purple-500/10 blur-xl" />
        </motion.div>
      </div>

      {/* Text */}
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        Ready to be productive?
      </h3>
      
      <p className="text-text-muted mb-8 max-w-md mx-auto">
        Create your first task and start your journey toward dopamine-powered productivity.
      </p>

      {/* Call to Action */}
      <Button
        variant="premium"
        size="lg"
        onClick={onAddTask}
        icon={<Plus size={20} />}
        className="shadow-lg hover:shadow-2xl"
      >
        Create Your First Task
      </Button>

      {/* Decorative Elements */}
      <div className="relative mt-12">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl" />
        </div>
      </div>
    </motion.div>
  )
}