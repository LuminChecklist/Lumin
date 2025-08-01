// Application type definitions

export interface Task {
  id: string
  text: string
  completed: boolean
  completedAt?: string
  totalWorkTime: number // in minutes
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  autoHideCompleted: boolean
  collapseCompleted: boolean
  showConfetti: boolean
  showStats: boolean
  focusTime: number // in minutes
  breakTime: number // in minutes
}

export interface TimerSession {
  id: string
  taskId: string
  durationMinutes: number
  completed: boolean
  sessionType: 'focus' | 'break'
  startedAt: string
  completedAt?: string
}

export interface UserProfile {
  userId: string
  email: string
  isLuminPlus: boolean
  stripeCustomerId?: string
}

export interface TaskStats {
  totalTasks: number
  completedTasks: number
  todayCompleted: number
  totalFocusTime: number // in minutes
  completionRate: number // percentage
}

// Timer states
export type TimerState = 'idle' | 'running' | 'paused' | 'completed'

export interface TimerStatus {
  state: TimerState
  timeRemaining: number // in seconds
  totalTime: number // in seconds
  currentTask?: Task
}

// Animation states for tasks
export type TaskAnimationState = 'entering' | 'idle' | 'completing' | 'deleting'

// Premium feature flags
export interface PremiumFeatures {
  pastelGradients: boolean
  confettiRewards: boolean
  smoothAnimations: boolean
  focusTimer: boolean
  sounds: boolean // coming soon
}

// Stripe integration types
export interface StripeSession {
  sessionId: string
  customerId: string
  paymentStatus: 'paid' | 'unpaid' | 'no_payment_required'
  userId: string
}

// Settings categories
export type SettingCategory = 'general' | 'timer' | 'appearance' | 'premium'

// Notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary'
}