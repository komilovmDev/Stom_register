'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useSWR from 'swr'
import { PatientsResponse } from '@/types/api'
import { TrendingUp, Users, Activity } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ReportsPage() {
  const { data, error, isLoading } = useSWR<PatientsResponse>(
    '/api/patients?page=1&limit=1000',
    fetcher
  )

  const topPatients = data?.patients
    ?.sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, 5) || []

  const chartData = topPatients.map((patient) => ({
    name: patient.fullName.split(' ')[0] + ' ' + (patient.fullName.split(' ')[1]?.[0] || ''),
    visits: patient.visitCount,
  }))

  const totalPatients = data?.pagination?.total || 0
  const totalVisits = data?.patients?.reduce((sum, p) => sum + p.visitCount, 0) || 0

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">View patient statistics and analytics</p>
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
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">View patient statistics and analytics</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-destructive">Error loading reports</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">View patient statistics and analytics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">Registered patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisits}</div>
              <p className="text-xs text-muted-foreground">All time visits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Visits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPatients > 0 ? (totalVisits / totalPatients).toFixed(1) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Per patient</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Most Frequent Patients</CardTitle>
            <CardDescription>Patients with the highest visit counts</CardDescription>
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
                No patient data available
              </div>
            )}
          </CardContent>
        </Card>

        {topPatients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>Top patients by visit count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPatients.map((patient, index) => (
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
                      <p className="text-xs text-muted-foreground">visits</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

