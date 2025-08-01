'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface TaskInputProps {
  isVisible: boolean
  onSubmit: (text: string) => void
  onCancel: () => void
}

export default function TaskInput({ isVisible, onSubmit, onCancel }: TaskInputProps) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!text.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    // Add some visual feedback delay
    setTimeout(() => {
      onSubmit(text.trim())
      setText('')
      setIsSubmitting(false)
    }, 200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Container */}
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="What needs to be done?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-24"
                rightIcon={
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onCancel}
                      icon={<X size={16} />}
                      className="hover:bg-red-500/20 hover:text-red-400"
                    >
                      <span className="sr-only">Cancel</span>
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      disabled={!text.trim() || isSubmitting}
                      loading={isSubmitting}
                      icon={<Send size={16} />}
                      className="hover:bg-green-500/20 hover:text-green-400 disabled:opacity-50"
                    >
                      <span className="sr-only">Add task</span>
                    </Button>
                  </div>
                }
              />
            </div>

            {/* Hint Text */}
            <p className="text-xs text-text-muted text-center">
              Press Enter to add • Escape to cancel
            </p>
          </form>

          {/* Background Blur Effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-xl backdrop-blur-sm" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}