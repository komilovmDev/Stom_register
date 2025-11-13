'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { ProtectedRoute } from '@/components/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Sozlamalar</h1>
          <p className="text-muted-foreground">Ilova sozlamalarini boshqaring</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ko'rinish</CardTitle>
            <CardDescription>Ilova ko'rinishini sozlang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                >
                  Yorug'
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                >
                  Qorong'u
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                >
                  Tizim
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Information about the application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Version:</strong> 1.0.0
              </p>
              <p className="text-sm text-muted-foreground">
                Dental Clinic Patient Management System
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
}

