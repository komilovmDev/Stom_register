'use client'

import useSWR from 'swr'
import { DashboardLayout } from '@/components/dashboard/layout'
import { ProtectedRoute } from '@/components/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Activity, TrendingUp, Calendar } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch')
  }
  return res.json()
}

export default function DashboardPage() {
  // API'dan ma'lumotlarni olish
  const { data, error, isLoading } = useSWR('/api/patients?page=1&limit=1000', fetcher)
  
  const patients = data?.patients || []
  const totalPatients = patients.length
  const totalVisits = patients.reduce((sum: number, p: any) => sum + (p.visitCount || 0), 0)
  const avgVisits = totalPatients > 0 ? (totalVisits / totalPatients).toFixed(1) : 0
  
  // Bu oy yangi bemorlar
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthPatients = patients.filter((p: any) => {
    const createdDate = new Date(p.createdAt)
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
  }).length

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Boshqaruv paneli</h1>
          <p className="text-muted-foreground">Stomatologiya klinikasi boshqaruv tizimiga xush kelibsiz</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jami bemorlar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{totalPatients}</div>
              )}
              <p className="text-xs text-muted-foreground">Ro'yxatdan o'tgan bemorlar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jami kelishlar</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{totalVisits}</div>
              )}
              <p className="text-xs text-muted-foreground">Barcha vaqt kelishlari</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">O'rtacha kelishlar</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{avgVisits}</div>
              )}
              <p className="text-xs text-muted-foreground">Har bir bemor uchun</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu oy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{thisMonthPatients}</div>
              )}
              <p className="text-xs text-muted-foreground">Yangi bemorlar</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tezkor amallar</CardTitle>
            <CardDescription>Keng tarqalgan vazifalar va qisqa yo'llar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Bemorlar, hisobotlar va sozlamalarga kirish uchun navigatsiya menyusidan foydalaning.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
}

