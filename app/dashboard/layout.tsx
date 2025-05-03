import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-base-200">
      {children}
    </div>
  )
} 