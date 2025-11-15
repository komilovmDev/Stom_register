'use client'

import { useState, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Edit, Trash2, UserPlus, Search, Users, Minus, Hash, History, Calendar, Phone, MapPin, User } from 'lucide-react'
import { Patient, CreatePatientPayload, UpdatePatientPayload, PatientsResponse, Visit, CreateVisitPayload, VisitsResponse } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { ProtectedRoute } from '@/components/protected-route'

// API fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch')
  }
  return res.json()
}


export default function PatientsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showVisitDialog, setShowVisitDialog] = useState(false)
  const [showEditVisitDialog, setShowEditVisitDialog] = useState(false)
  const [showPatientProfileDialog, setShowPatientProfileDialog] = useState(false)
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null)
  const [visitPatient, setVisitPatient] = useState<Patient | null>(null)
  const [visitCount, setVisitCount] = useState<number>(0)
  const [visitReason, setVisitReason] = useState<string>('')
  const [visitDate, setVisitDate] = useState<string>('')
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    address: '',
    phone: '',
  })
  const { toast } = useToast()

  const limit = 10

  // API'dan ma'lumotlarni olish
  const apiUrl = `/api/patients?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`
  const { data, error, isLoading, mutate } = useSWR<PatientsResponse>(apiUrl, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  const patients = data?.patients || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  // Search o'zgarganda page'ni 1 ga qaytarish
  useEffect(() => {
    if (search && page !== 1) {
      setPage(1)
    }
  }, [search])

  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isCreating) return // Debounce
    
    setIsCreating(true)
    try {
      // Telefon raqamini to'g'ri formatlash
      let phoneValue: string | undefined = undefined
      if (formData.phone && formData.phone.trim()) {
        const phone = formData.phone.trim()
        if (phone.startsWith('+998')) {
          phoneValue = phone
        } else {
          const digitsOnly = phone.replace(/\D/g, '')
          if (digitsOnly.length === 9) {
            phoneValue = `+998${digitsOnly}`
          } else if (digitsOnly.length > 0) {
            throw new Error('Telefon raqami 9 ta raqamdan iborat bo\'lishi kerak')
          }
        }
      }
      
      const payload: CreatePatientPayload = {
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        address: formData.address,
        phone: phoneValue,
      }

      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create patient')
      }

      const newPatient = await res.json()
      setFormData({ fullName: '', birthDate: '', address: '', phone: '' })
      setShowAddDialog(false)
      
      // Ma'lumotlarni yangilash
      mutate()
      
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Bemor muvaffaqiyatli ro\'yxatga olindi',
      })
    } catch (error: any) {
      console.error('Error creating patient:', error)
      toast({
        title: 'Xatolik',
        description: error.message || 'Bemorni yaratishda xatolik yuz berdi',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPatient || isUpdating) return // Debounce

    setIsUpdating(true)
    try {
      // Telefon raqamini to'g'ri formatlash
      let phoneValue: string | undefined = undefined
      if (formData.phone && formData.phone.trim()) {
        const phone = formData.phone.trim()
        // Agar allaqachon +998 bilan boshlansa, o'zgartirmaslik
        if (phone.startsWith('+998')) {
          phoneValue = phone
        } else {
          // Faqat raqamlarni olish va +998 qo'shish
          const digitsOnly = phone.replace(/\D/g, '')
          if (digitsOnly.length === 9) {
            phoneValue = `+998${digitsOnly}`
          } else if (digitsOnly.length > 0) {
            // Agar 9 ta raqam bo'lmasa, xatolik
            throw new Error('Telefon raqami 9 ta raqamdan iborat bo\'lishi kerak')
          }
        }
      }
      
      const payload: UpdatePatientPayload = {
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        address: formData.address,
        phone: phoneValue,
      }

      const res = await fetch(`/api/patients/${editingPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        let errorMessage = errorData.error || 'Failed to update patient'
        
        // Validation error'larni batafsil ko'rsatish
        if (errorData.details && Array.isArray(errorData.details)) {
          const validationErrors = errorData.details
            .map((err: any) => `${err.path.join('.')}: ${err.message}`)
            .join(', ')
          errorMessage = `Validation error: ${validationErrors}`
        }
        
        throw new Error(errorMessage)
      }

      setShowEditDialog(false)
      setEditingPatient(null)
      setFormData({ fullName: '', birthDate: '', address: '', phone: '' })
      
      // Ma'lumotlarni yangilash
      mutate()
      
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Bemor ma\'lumotlari muvaffaqiyatli yangilandi',
      })
    } catch (error: any) {
      console.error('Error updating patient:', error)
      toast({
        title: 'Xatolik',
        description: error.message || 'Bemor ma\'lumotlarini yangilashda xatolik yuz berdi',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingPatientId || isDeleting) return // Debounce

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/patients/${deletingPatientId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete patient')
      }

      setShowDeleteDialog(false)
      setDeletingPatientId(null)
      
      // Ma'lumotlarni yangilash
      mutate()
      
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Bemor muvaffaqiyatli o\'chirildi',
      })
    } catch (error: any) {
      console.error('Error deleting patient:', error)
      toast({
        title: 'Xatolik',
        description: error.message || 'Bemorni o\'chirishda xatolik yuz berdi',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRegisterVisitClick = (patient: Patient) => {
    setVisitPatient(patient)
    // Default sana va vaqt - hozirgi vaqt
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5)
    setVisitDate(`${dateStr}T${timeStr}`)
    setShowVisitDialog(true)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRegisterVisit = async () => {
    if (isSubmitting) return // Debounce
    
    if (!visitPatient || !visitReason.trim()) {
      toast({
        title: 'Xatolik',
        description: 'Kasallik nomi yoki kelish sababi kiritilishi kerak',
        variant: 'destructive',
      })
      return
    }

    if (!visitDate || !visitDate.trim()) {
      toast({
        title: 'Xatolik',
        description: 'Sana kiritilishi majburiy',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Sana va vaqt formatini tekshirish va to'g'rilash
      let formattedDate = visitDate.trim()
      
      // Agar ISO format bo'lsa (YYYY-MM-DDTHH:mm), to'g'ri formatda
      if (formattedDate.includes('T')) {
        // Sana va vaqtni ajratish
        const [datePart, timePart] = formattedDate.split('T')
        if (!datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
          throw new Error('Sana noto\'g\'ri formatda. YYYY-MM-DD formatida kiriting')
        }
        // Vaqtni to'g'rilash (HH:mm formatida)
        if (timePart) {
          const time = timePart.substring(0, 5) // HH:mm qismini olish
          if (!time.match(/^\d{2}:\d{2}$/)) {
            throw new Error('Vaqt noto\'g\'ri formatda. HH:mm formatida kiriting')
          }
          formattedDate = `${datePart}T${time}:00`
        } else {
          formattedDate = datePart
        }
      } else if (!formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Sana noto\'g\'ri formatda. YYYY-MM-DD formatida kiriting')
      }
      
      const payload: CreateVisitPayload = {
        reason: visitReason.trim(),
        visitDate: formattedDate,
      }

      const res = await fetch(`/api/patients/${visitPatient.id}/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to register visit')
      }

      setShowVisitDialog(false)
      setVisitPatient(null)
      setVisitReason('')
      setVisitDate('')
      
      // Ma'lumotlarni yangilash
      mutate() // Patients list'ni yangilash
      
      // VisitHistory komponentini yangilash
      window.dispatchEvent(new Event('visitAdded'))
      
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Kelish muvaffaqiyatli ro\'yxatga olindi',
      })
    } catch (error: any) {
      console.error('Error registering visit:', error)
      toast({
        title: 'Xatolik',
        description: error.message || 'Kelishni ro\'yxatga olishda xatolik yuz berdi',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShowPatientProfile = (patient: Patient) => {
    setVisitPatient(patient)
    setShowPatientProfileDialog(true)
  }

  const handleEditVisitClick = (patient: Patient) => {
    setVisitPatient(patient)
    setVisitCount(patient.visitCount)
    setShowEditVisitDialog(true)
  }

  const handleUpdateVisitCount = async () => {
    if (!visitPatient) return

    try {
      setPatients(
        patients.map((p) =>
          p.id === visitPatient.id
            ? {
                ...p,
                visitCount: visitCount,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      )

      setShowEditVisitDialog(false)
      setVisitPatient(null)
      setVisitCount(0)
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Kelishlar soni muvaffaqiyatli yangilandi',
      })
    } catch (error) {
      console.error('Error updating visit count:', error)
      toast({
        title: 'Xatolik',
        description: 'Kelishlar sonini yangilashda xatolik yuz berdi',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    // Telefon raqamidan +998 ni olib tashlash
    const phoneWithoutPrefix = patient.phone?.replace(/^\+998/, '') || ''
    
    // birthDate'ni to'g'ri formatlash
    let birthDateFormatted = ''
    if (patient.birthDate) {
      if (typeof patient.birthDate === 'string') {
        birthDateFormatted = patient.birthDate.split('T')[0]
      } else {
        // Agar Date object bo'lsa
        const date = new Date(patient.birthDate)
        birthDateFormatted = date.toISOString().split('T')[0]
      }
    }
    
    setFormData({
      fullName: patient.fullName || '',
      birthDate: birthDateFormatted,
      address: patient.address || '',
      phone: phoneWithoutPrefix,
    })
    setShowEditDialog(true)
  }

  const handleDeleteClick = (patientId: string) => {
    setDeletingPatientId(patientId)
    setShowDeleteDialog(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Bemorlar</h1>
              <p className="text-muted-foreground">Bemorlar ro'yxatini boshqaring</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Yangi bemor qo'shish
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bemorlar ro'yxati</CardTitle>
              <CardDescription>Bemorlarni qidiring va boshqaring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Ism, telefon yoki manzil bo'yicha qidiring..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    className="pl-8 max-w-sm"
                  />
                </div>
              </div>

              {isLoading && (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <div className="text-destructive font-semibold mb-2">
                    Bemorlarni yuklashda xatolik: {error.message || 'Noma\'lum xatolik'}
                  </div>
                  {error.message?.includes('Database connection') && (
                    <div className="text-sm text-muted-foreground space-y-2 mt-4">
                      <p>Iltimos, tekshiring:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Asosiy papkada <code className="bg-muted px-1 rounded">.env</code> faylini yarating</li>
                        <li>PostgreSQL ulanish stringini bilan <code className="bg-muted px-1 rounded">DATABASE_URL</code> qo'shing</li>
                        <li>PostgreSQL ishlayotganligiga ishonch hosil qiling</li>
                        <li>Ma'lumotlar bazasini sozlash uchun <code className="bg-muted px-1 rounded">npm run db:migrate</code> ni ishga tushiring</li>
                        <li>Prisma client'ni yaratish uchun <code className="bg-muted px-1 rounded">npm run db:generate</code> ni ishga tushiring</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {data && data.patients && data.patients.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Bemorlar topilmadi</h3>
                  <p className="text-muted-foreground mb-4">
                    {search ? 'Qidiruvni o\'zgartiring' : 'Yangi bemor qo\'shish orqali boshlang'}
                  </p>
                  {!search && (
                    <Button onClick={() => setShowAddDialog(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Bemor qo'shish
                    </Button>
                  )}
                </div>
              )}

              {data && data.patients && data.patients.length > 0 && (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>To'liq ism</TableHead>
                          <TableHead>Tug'ilgan sana</TableHead>
                          <TableHead>Telefon</TableHead>
                          <TableHead>Manzil</TableHead>
                          <TableHead>Kelishlar</TableHead>
                          <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.patients.map((patient) => (
                          <motion.tr
                            key={patient.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => handleShowPatientProfile(patient)}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              {patient.fullName}
                            </TableCell>
                            <TableCell>{formatDate(patient.birthDate)}</TableCell>
                            <TableCell>{patient.phone || '-'}</TableCell>
                            <TableCell className="max-w-xs truncate">{patient.address}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{patient.visitCount}</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditVisitClick(patient)}
                                  className="h-6 w-6 p-0"
                                  title="Kelishlar sonini tahrirlash"
                                >
                                  <Hash className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRegisterVisitClick(patient)}
                                  title="Kelish qo'shish"
                                >
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(patient)}
                                  title="Bemorni tahrirlash"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteClick(patient.id)}
                                  title="Bemorni o'chirish"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {data.pagination && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {(page - 1) * limit + 1} dan {Math.min(page * limit, data.pagination.total)} gacha, jami{' '}
                        {data.pagination.total} ta bemor
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          Oldingi
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => p + 1)}
                          disabled={page >= data.pagination.totalPages}
                        >
                          Keyingi
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi bemor qo'shish</DialogTitle>
              <DialogDescription>Quyida bemor ma'lumotlarini kiriting</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">To'liq ism</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthDate">Tug'ilgan sana</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefon raqami</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground px-2">+998</span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="901234567"
                      value={formData.phone}
                      onChange={(e) => {
                        // Faqat raqamlarni qabul qilish
                        const value = e.target.value.replace(/\D/g, '')
                        // Maksimal 9 ta raqam
                        const limitedValue = value.slice(0, 9)
                        setFormData({ ...formData, phone: limitedValue })
                      }}
                      maxLength={9}
                      className="flex-1"
                    />
                  </div>
                  {formData.phone && (
                    <p className="text-xs text-muted-foreground">+998{formData.phone}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Manzil</Label>
                  <Textarea
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Saqlanmoqda...' : 'Bemor qo\'shish'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bemorni tahrirlash</DialogTitle>
              <DialogDescription>Quyida bemor ma'lumotlarini yangilang</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editFullName">To'liq ism</Label>
                  <Input
                    id="editFullName"
                    required
                    value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editBirthDate">Tug'ilgan sana</Label>
                <Input
                  id="editBirthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editPhone">Telefon raqami</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground px-2">+998</span>
                  <Input
                    id="editPhone"
                    type="tel"
                    placeholder="901234567"
                    value={formData.phone}
                    onChange={(e) => {
                      // Faqat raqamlarni qabul qilish
                      const value = e.target.value.replace(/\D/g, '')
                      // Maksimal 9 ta raqam
                      const limitedValue = value.slice(0, 9)
                      setFormData({ ...formData, phone: limitedValue })
                    }}
                    maxLength={9}
                    className="flex-1"
                  />
                </div>
                {formData.phone && (
                  <p className="text-xs text-muted-foreground">+998{formData.phone}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editAddress">Manzil</Label>
                <Textarea
                  id="editAddress"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Yangilanmoqda...' : 'Bemorni yangilash'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bemorni o'chirish</DialogTitle>
            <DialogDescription>
              Bu bemorni o'chirishni xohlaysizmi? Bu amalni bekor qilib bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Bekor qilish
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'O\'chirilmoqda...' : 'O\'chirish'}
            </Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Visit Confirmation Dialog */}
        <Dialog open={showVisitDialog} onOpenChange={setShowVisitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kelishni ro'yxatga olish</DialogTitle>
              <DialogDescription>
                <strong>{visitPatient?.fullName}</strong> uchun yangi kelishni ro'yxatga oling
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleRegisterVisit()
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="visitReason">Kasallik nomi yoki kelish sababi *</Label>
                  <Textarea
                    id="visitReason"
                    required
                    placeholder="Masalan: Tish og&apos;rig&apos;i, Tish tozalash, Konsultatsiya..."
                    value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="visitDate">
                  Sana va vaqt * 
                  <span className="text-xs text-muted-foreground ml-2">(Masalan: 2025-11-15)</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="visitDate"
                    type="date"
                    value={visitDate.includes('T') ? visitDate.split('T')[0] : visitDate}
                    onChange={(e) => {
                      const date = e.target.value
                      const time = visitDate.includes('T') ? visitDate.split('T')[1] : ''
                      if (time) {
                        setVisitDate(`${date}T${time}`)
                      } else {
                        setVisitDate(date)
                      }
                    }}
                    required
                    className="flex-1"
                  />
                  <Input
                    id="visitTime"
                    type="time"
                    value={visitDate.includes('T') ? visitDate.split('T')[1]?.substring(0, 5) : ''}
                    onChange={(e) => {
                      const time = e.target.value
                      const date = visitDate.includes('T') ? visitDate.split('T')[0] : visitDate || new Date().toISOString().split('T')[0]
                      if (time) {
                        setVisitDate(`${date}T${time}`)
                      } else {
                        setVisitDate(date)
                      }
                    }}
                    className="w-32"
                  />
                </div>
                {visitDate && (
                  <p className="text-xs text-muted-foreground">
                    Tanlangan: {(() => {
                      try {
                        const dateStr = visitDate.includes('T') ? visitDate : `${visitDate}T00:00`
                        return new Date(dateStr).toLocaleString('uz-UZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      } catch {
                        return visitDate
                      }
                    })()}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowVisitDialog(false)
                  setVisitReason('')
                  setVisitDate('')
                }}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saqlanmoqda...' : 'Kelishni ro\'yxatga olish'}
              </Button>
            </DialogFooter>
          </form>
          </DialogContent>
        </Dialog>

        {/* Edit Visit Count Dialog */}
        <Dialog open={showEditVisitDialog} onOpenChange={setShowEditVisitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kelishlar sonini tahrirlash</DialogTitle>
              <DialogDescription>
                <strong>{visitPatient?.fullName}</strong> uchun kelishlar sonini yangilang. Joriy son:{' '}
                <strong>{visitPatient?.visitCount}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="visitCount">Kelishlar soni</Label>
              <Input
                id="visitCount"
                type="number"
                min="0"
                required
                value={visitCount}
                onChange={(e) => setVisitCount(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditVisitDialog(false)
                setVisitPatient(null)
                setVisitCount(0)
              }}
            >
              Bekor qilish
            </Button>
            <Button type="button" onClick={handleUpdateVisitCount}>
              Kelishlar sonini yangilash
            </Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Patient Profile Dialog */}
        <Dialog open={showPatientProfileDialog} onOpenChange={setShowPatientProfileDialog}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Bemor Profili</DialogTitle>
              <DialogDescription>
                Bemorning barcha ma&apos;lumotlari va kasallik tarixi
              </DialogDescription>
            </DialogHeader>

            {visitPatient && (
              <div className="space-y-6 py-4">
                {/* Patient Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Shaxsiy Ma&apos;lumotlar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">To&apos;liq Ism</Label>
                        <p className="text-base font-medium">{visitPatient.fullName}</p>
                      </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Tug&apos;ilgan sana
                      </Label>
                      <p className="text-base font-medium">{formatDate(visitPatient.birthDate)}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefon raqami
                      </Label>
                      <p className="text-base font-medium">{visitPatient.phone || '-'}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Kelishlar soni
                      </Label>
                      <p className="text-base font-medium">{visitPatient.visitCount} ta</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Manzil
                    </Label>
                    <p className="text-base font-medium">{visitPatient.address}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Yaratilgan:</span>{' '}
                        {(() => {
                          const date = new Date(visitPatient.createdAt)
                          const year = date.getFullYear()
                          const day = date.getDate()
                          const monthNames = [
                            'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
                            'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
                          ]
                          const monthName = monthNames[date.getMonth()]
                          return `${year}-yil ${day}-${monthName}`
                        })()}
                      </div>
                      <div>
                        <span className="font-medium">Yangilangan:</span>{' '}
                        {(() => {
                          const date = new Date(visitPatient.updatedAt)
                          const year = date.getFullYear()
                          const day = date.getDate()
                          const monthNames = [
                            'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
                            'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
                          ]
                          const monthName = monthNames[date.getMonth()]
                          return `${year}-yil ${day}-${monthName}`
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical History Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Kasallik Tarixi
                  </CardTitle>
                  <CardDescription>
                    Bemorning barcha kelishlari va kasalliklari ro&apos;yxati
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VisitHistory 
                    patientId={visitPatient.id} 
                    patients={patients}
                    key={visitPatient.id}
                  />
                </CardContent>
              </Card>
            </div>
          )}
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

// Visit History Component
function VisitHistory({ 
  patientId, 
  patients
}: { 
  patientId: string
  patients: Patient[]
}) {
  // API'dan visit'larni olish
  const { data: visitsData, error, isLoading, mutate: mutateVisits } = useSWR<VisitsResponse>(
    patientId ? `/api/patients/${patientId}/visit?page=1&limit=100` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0, // Auto-refresh o'chirilgan
    }
  )
  
  const visits = visitsData?.visits || []
  
  // Visit qo'shilgandan keyin yangilash uchun global event listener
  useEffect(() => {
    const handleVisitAdded = () => {
      mutateVisits()
    }
    
    // Custom event listener
    window.addEventListener('visitAdded', handleVisitAdded)
    
    return () => {
      window.removeEventListener('visitAdded', handleVisitAdded)
    }
  }, [mutateVisits])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const day = date.getDate()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      
      // Oyni nomi bilan olish
      const monthNames = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
      ]
      const monthName = monthNames[date.getMonth()]
      
      // Format: 2025-yil 15-noyabr soat: 15:58
      return `${year}-yil ${day}-${monthName} soat: ${hours}:${minutes}`
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading visit history: {error.message || 'Unknown error'}
      </div>
    )
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
  <h3 className="text-lg font-semibold mb-2">Kasallik tarixi yo&apos;q</h3>
        <p className="text-muted-foreground">Bu bemor hali hech qachon kelmagan</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {visits.map((visit: Visit) => (
          <Card key={visit.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {formatDate(visit.visitDate)}
                    </span>
                  </div>
                  <p className="text-base">{visit.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {visits.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Jami {visits.length} ta visit
        </div>
      )}
    </div>
  )
}
