'use client'

import { useState } from 'react'
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
import { Plus, Edit, Trash2, UserPlus, Search, Users } from 'lucide-react'
import { Patient, CreatePatientPayload, UpdatePatientPayload, PatientsResponse } from '@/types/api'
import { useToast } from '@/hooks/use-toast'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to fetch' }))
    throw new Error(error.error || 'Failed to fetch patients')
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
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    address: '',
  })
  const { toast } = useToast()

  const limit = 10
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  })

  const { data, error, isLoading, mutate } = useSWR<PatientsResponse>(
    `/api/patients?${searchParams.toString()}`,
    fetcher
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload: CreatePatientPayload = {
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        address: formData.address,
      }

      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to create patient',
          variant: 'destructive',
        })
        return
      }

      setFormData({ fullName: '', birthDate: '', address: '' })
      setShowAddDialog(false)
      toast({
        title: 'Success',
        description: 'Patient registered successfully',
      })
      mutate()
    } catch (error) {
      console.error('Error creating patient:', error)
      toast({
        title: 'Error',
        description: 'Failed to create patient',
        variant: 'destructive',
      })
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPatient) return

    try {
      const payload: UpdatePatientPayload = {
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        address: formData.address,
      }

      const response = await fetch(`/api/patients/${editingPatient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to update patient',
          variant: 'destructive',
        })
        return
      }

      setShowEditDialog(false)
      setEditingPatient(null)
      setFormData({ fullName: '', birthDate: '', address: '' })
      toast({
        title: 'Success',
        description: 'Patient updated successfully',
      })
      mutate()
    } catch (error) {
      console.error('Error updating patient:', error)
      toast({
        title: 'Error',
        description: 'Failed to update patient',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!deletingPatientId) return

    try {
      const response = await fetch(`/api/patients/${deletingPatientId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete patient',
          variant: 'destructive',
        })
        return
      }

      setShowDeleteDialog(false)
      setDeletingPatientId(null)
      toast({
        title: 'Success',
        description: 'Patient deleted successfully',
      })
      mutate()
    } catch (error) {
      console.error('Error deleting patient:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete patient',
        variant: 'destructive',
      })
    }
  }

  const handleRegisterVisit = async (patientId: string, currentVisitCount: number) => {
    try {
      // Optimistic update
      mutate(
        (currentData: PatientsResponse | undefined) => {
          if (!currentData) return currentData
          return {
            ...currentData,
            patients: currentData.patients.map((p) =>
              p.id === patientId ? { ...p, visitCount: p.visitCount + 1 } : p
            ),
          }
        },
        false
      )

      const response = await fetch(`/api/patients/${patientId}/visit`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to register visit',
          variant: 'destructive',
        })
        mutate()
        return
      }

      toast({
        title: 'Success',
        description: 'Visit registered successfully',
      })
      mutate()
    } catch (error) {
      console.error('Error registering visit:', error)
      toast({
        title: 'Error',
        description: 'Failed to register visit',
        variant: 'destructive',
      })
      mutate()
    }
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData({
      fullName: patient.fullName,
      birthDate: patient.birthDate.split('T')[0],
      address: patient.address,
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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-muted-foreground">Manage your patient records</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>Search and manage your patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name..."
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
              <div className="text-center py-8 text-destructive">
                Error loading patients: {error.message || 'Unknown error'}
              </div>
            )}

            {data && data.patients && data.patients.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No patients found</h3>
                <p className="text-muted-foreground mb-4">
                  {search ? 'Try adjusting your search' : 'Get started by adding a new patient'}
                </p>
                {!search && (
                  <Button onClick={() => setShowAddDialog(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Patient
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
                        <TableHead>Full Name</TableHead>
                        <TableHead>Birth Date</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Visits</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.patients.map((patient) => (
                        <motion.tr
                          key={patient.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TableCell className="font-medium">{patient.fullName}</TableCell>
                          <TableCell>{formatDate(patient.birthDate)}</TableCell>
                          <TableCell className="max-w-xs truncate">{patient.address}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{patient.visitCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegisterVisit(patient.id, patient.visitCount)}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(patient)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClick(patient.id)}
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
                      Showing {(page - 1) * limit + 1} to {Math.min(page * limit, data.pagination.total)} of{' '}
                      {data.pagination.total} patients
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= data.pagination.totalPages}
                      >
                        Next
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
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>Enter the patient information below</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
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
                Cancel
              </Button>
              <Button type="submit">Add Patient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>Update the patient information below</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editFullName">Full Name</Label>
                <Input
                  id="editFullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editBirthDate">Birth Date</Label>
                <Input
                  id="editBirthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editAddress">Address</Label>
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
                Cancel
              </Button>
              <Button type="submit">Update Patient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Patient</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this patient? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
