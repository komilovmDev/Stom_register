'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { ProtectedRoute } from '@/components/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Activity } from 'lucide-react'

export default function ReportsPage() {
  // Get data from localStorage
  const getPatientsData = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('patients')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return []
        }
      }
    }
    return []
  }

  const patients: any[] = getPatientsData()
  const isLoading = false
  const error: any = null

  const topPatients = patients
    .sort((a: any, b: any) => b.visitCount - a.visitCount)
    .slice(0, 5)

  const chartData = topPatients.map((patient: any) => ({
    name: patient.fullName.split(' ')[0] + ' ' + (patient.fullName.split(' ')[1]?.[0] || ''),
    visits: patient.visitCount,
  }))

  const totalPatients = patients.length
  const totalVisits = patients.reduce((sum: number, p: any) => sum + (p.visitCount || 0), 0)

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Hisobotlar</h1>
              <p className="text-muted-foreground">Bemorlar statistikasi va tahlillarini ko'ring</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Hisobotlar</h1>
              <p className="text-muted-foreground">Bemorlar statistikasi va tahlillarini ko'ring</p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-destructive">Hisobotlarni yuklashda xatolik</p>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">View patient statistics and analytics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jami bemorlar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">Ro'yxatdan o'tgan bemorlar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jami kelishlar</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisits}</div>
              <p className="text-xs text-muted-foreground">Barcha vaqt kelishlari</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">O'rtacha kelishlar</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPatients > 0 ? (totalVisits / totalPatients).toFixed(1) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Har bir bemor uchun</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Eng ko'p kelgan 5 ta bemor</CardTitle>
            <CardDescription>Eng ko'p kelishlar soniga ega bemorlar</CardDescription>
          </CardHeader>
          <CardContent>
            {topPatients.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visits" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Bemor ma'lumotlari mavjud emas
              </div>
            )}
          </CardContent>
        </Card>

        {topPatients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Bemorlar ro'yxati</CardTitle>
              <CardDescription>Kelishlar soni bo'yicha eng yaxshi bemorlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPatients.map((patient: any, index: number) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{patient.fullName}</p>
                        <p className="text-sm text-muted-foreground">{patient.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{patient.visitCount}</p>
                      <p className="text-xs text-muted-foreground">kelish</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

