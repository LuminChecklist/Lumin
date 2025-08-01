import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lumin - Psychology-Optimized Checklist',
  description: 'Turn your tasks into dopamine with psychology-powered productivity',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-primary text-text-primary min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}