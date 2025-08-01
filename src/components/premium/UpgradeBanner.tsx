'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface UpgradeBannerProps {
  onUpgradeClick: () => void
}

export default function UpgradeBanner({ onUpgradeClick }: UpgradeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <button
        onClick={onUpgradeClick}
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 
                   border border-purple-500/30 hover:border-purple-400/50 
                   backdrop-blur-sm transition-all duration-300 
                   hover:shadow-lg hover:shadow-purple-500/25 group"
      >
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="text-yellow-400 group-hover:rotate-12 transition-transform duration-300" size={20} />
          
          <span className="text-text-primary font-semibold">
            Unlock Lumin+ visual experience for just
          </span>
          
          <span className="premium-text-gradient font-bold text-lg">
            $0.99
          </span>
        </div>
      </button>
    </motion.div>
  )
}