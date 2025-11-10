'use client'

import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <Navbar />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

