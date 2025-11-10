'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { Plus, Edit, Trash2, UserPlus, Search, Users, Minus, Hash, History, Calendar } from 'lucide-react'
import { Patient, CreatePatientPayload, UpdatePatientPayload, PatientsResponse, Visit, CreateVisitPayload, VisitsResponse } from '@/types/api'
import { useToast } from '@/hooks/use-toast'
import { ProtectedRoute } from '@/components/protected-route'

// Mock data - vaqtinchalik frontend'da saqlanadi
const generateId = () => Math.random().toString(36).substring(2, 15)

const initialMockPatients: Patient[] = [
  {
    id: generateId(),
    fullName: 'Ali Valiyev',
    birthDate: '1985-03-15',
    address: 'Toshkent shahri, Yunusobod tumani, Navoiy ko\'chasi 12-uy',
    visitCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    visits: [
      {
        id: generateId(),
        patientId: '',
        reason: 'Ro\'yxatdan o\'tish / Birinchi konsultatsiya',
        visitDate: new Date('2024-01-15').toISOString(),
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString(),
      },
      {
        id: generateId(),
        patientId: '',
        reason: 'Tish og\'rig\'i',
        visitDate: new Date('2024-02-20').toISOString(),
        createdAt: new Date('2024-02-20').toISOString(),
        updatedAt: new Date('2024-02-20').toISOString(),
      },
      {
        id: generateId(),
        patientId: '',
        reason: 'Tish tozalash',
        visitDate: new Date('2024-03-10').toISOString(),
        createdAt: new Date('2024-03-10').toISOString(),
        updatedAt: new Date('2024-03-10').toISOString(),
      },
    ],
  },
  {
    id: generateId(),
    fullName: 'Dilshoda Karimova',
    birthDate: '1992-07-22',
    address: 'Toshkent shahri, Chilonzor tumani, Bunyodkor ko\'chasi 45-uy',
    visitCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    visits: [
      {
        id: generateId(),
        patientId: '',
        reason: 'Ro\'yxatdan o\'tish / Birinchi konsultatsiya',
        visitDate: new Date('2024-01-20').toISOString(),
        createdAt: new Date('2024-01-20').toISOString(),
        updatedAt: new Date('2024-01-20').toISOString(),
      },
      {
        id: generateId(),
        patientId: '',
        reason: 'Konsultatsiya',
        visitDate: new Date('2024-02-25').toISOString(),
        createdAt: new Date('2024-02-25').toISOString(),
        updatedAt: new Date('2024-02-25').toISOString(),
      },
    ],
  },
  {
    id: generateId(),
    fullName: 'Otabek Toshmatov',
    birthDate: '1988-11-08',
    address: 'Toshkent shahri, Mirzo Ulug\'bek tumani, Amir Temur ko\'chasi 78-uy',
    visitCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    visits: [
      {
        id: generateId(),
        patientId: '',
        reason: 'Ro\'yxatdan o\'tish / Birinchi konsultatsiya',
        visitDate: new Date('2024-01-10').toISOString(),
        createdAt: new Date('2024-01-10').toISOString(),
        updatedAt: new Date('2024-01-10').toISOString(),
      },
      {
        id: generateId(),
        patientId: '',
        reason: 'Tish implantatsiyasi',
        visitDate: new Date('2024-01-25').toISOString(),
        createdAt: new Date('2024-01-25').toISOString(),
        updatedAt: new Date('2024-01-25').toISOString(),
      },
      {
        id: generateId(),
        patientId: '',
        reason: 'Kontrol tekshiruvi',
        visitDate: new Date('2024-02-15').toISOString(),
        createdAt: new Date('2024-02-15').toISOString(),
        updatedAt: new Date('2024-02-15').toISOString(),
      },
    ],
  },
]

export default function PatientsPage() {
  // Local state bilan ishlash - API'siz
  const [patients, setPatients] = useState<Patient[]>(() => {
    // localStorage'dan o'qish yoki initial mock data
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('patients')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return initialMockPatients
        }
      }
    }
    return initialMockPatients
  })

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showVisitDialog, setShowVisitDialog] = useState(false)
  const [showEditVisitDialog, setShowEditVisitDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null)
  const [visitPatient, setVisitPatient] = useState<Patient | null>(null)
  const [visitCount, setVisitCount] = useState<number>(0)
  const [visitReason, setVisitReason] = useState<string>('')
  const [visitDate, setVisitDate] = useState<string>('')
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    address: '',
  })
  const { toast } = useToast()

  const limit = 10

  // localStorage'ga saqlash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('patients', JSON.stringify(patients))
    }
  }, [patients])

  // Filter va pagination
  const filteredPatients = useMemo(() => {
    let filtered = patients
    if (search) {
      filtered = patients.filter((p) =>
        p.fullName.toLowerCase().includes(search.toLowerCase())
      )
    }
    return filtered
  }, [patients, search])

  const paginatedPatients = useMemo(() => {
    const start = (page - 1) * limit
    return filteredPatients.slice(start, start + limit)
  }, [filteredPatients, page, limit])

  const totalPages = Math.ceil(filteredPatients.length / limit)

  // Mock data response
  const data: PatientsResponse = {
    patients: paginatedPatients,
    pagination: {
      page,
      limit,
      total: filteredPatients.length,
      totalPages,
    },
  }

  const isLoading = false
  const error: any = null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newPatient: Patient = {
        id: generateId(),
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        address: formData.address,
        visitCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        visits: [
          {
            id: generateId(),
            patientId: '',
            reason: 'Ro\'yxatdan o\'tish / Birinchi konsultatsiya',
            visitDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      }

      setPatients([newPatient, ...patients])
      setFormData({ fullName: '', birthDate: '', address: '' })
      setShowAddDialog(false)
      toast({
        title: 'Success',
        description: 'Patient registered successfully',
      })
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
      setPatients(
        patients.map((p) =>
          p.id === editingPatient.id
            ? {
                ...p,
                fullName: formData.fullName,
                birthDate: formData.birthDate,
                address: formData.address,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      )

      setShowEditDialog(false)
      setEditingPatient(null)
      setFormData({ fullName: '', birthDate: '', address: '' })
      toast({
        title: 'Success',
        description: 'Patient updated successfully',
      })
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
      setPatients(patients.filter((p) => p.id !== deletingPatientId))
      setShowDeleteDialog(false)
      setDeletingPatientId(null)
      toast({
        title: 'Success',
        description: 'Patient deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting patient:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete patient',
        variant: 'destructive',
      })
    }
  }

  const handleRegisterVisitClick = (patient: Patient) => {
    setVisitPatient(patient)
    setShowVisitDialog(true)
  }

  const handleRegisterVisit = async () => {
    if (!visitPatient || !visitReason.trim()) {
      toast({
        title: 'Error',
        description: 'Kasallik nomi yoki kelish sababi kiritilishi kerak',
        variant: 'destructive',
      })
      return
    }

    try {
      const newVisit: Visit = {
        id: generateId(),
        patientId: visitPatient.id,
        reason: visitReason,
        visitDate: visitDate ? new Date(visitDate).toISOString() : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setPatients(
        patients.map((p) =>
          p.id === visitPatient.id
            ? {
                ...p,
                visitCount: p.visitCount + 1,
                visits: [newVisit, ...(p.visits || [])],
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      )

      setShowVisitDialog(false)
      setVisitPatient(null)
      setVisitReason('')
      setVisitDate('')
      toast({
        title: 'Success',
        description: 'Visit registered successfully',
      })
    } catch (error) {
      console.error('Error registering visit:', error)
      toast({
        title: 'Error',
        description: 'Failed to register visit',
        variant: 'destructive',
      })
    }
  }

  const handleShowHistory = (patient: Patient) => {
    setVisitPatient(patient)
    setShowHistoryDialog(true)
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
        title: 'Success',
        description: 'Visit count updated successfully',
      })
    } catch (error) {
      console.error('Error updating visit count:', error)
      toast({
        title: 'Error',
        description: 'Failed to update visit count',
        variant: 'destructive',
      })
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
    <ProtectedRoute>
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
              <div className="text-center py-8">
                <div className="text-destructive font-semibold mb-2">
                  Error loading patients: {error.message || 'Unknown error'}
                </div>
                {error.message?.includes('Database connection') && (
                  <div className="text-sm text-muted-foreground space-y-2 mt-4">
                    <p>Please check:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Create a <code className="bg-muted px-1 rounded">.env</code> file in the root directory</li>
                      <li>Add <code className="bg-muted px-1 rounded">DATABASE_URL</code> with your PostgreSQL connection string</li>
                      <li>Make sure PostgreSQL is running</li>
                      <li>Run <code className="bg-muted px-1 rounded">npm run db:migrate</code> to set up the database</li>
                      <li>Run <code className="bg-muted px-1 rounded">npm run db:generate</code> to generate Prisma client</li>
                    </ul>
                  </div>
                )}
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
                          <TableCell className="font-medium">
                              <button
                              onClick={() => handleShowHistory(patient)}
                              className="hover:underline cursor-pointer text-left"
                              title="Kasallik tarixini ko&apos;rish"
                            >
                              {patient.fullName}
                            </button>
                          </TableCell>
                          <TableCell>{formatDate(patient.birthDate)}</TableCell>
                          <TableCell className="max-w-xs truncate">{patient.address}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{patient.visitCount}</Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditVisitClick(patient)}
                                className="h-6 w-6 p-0"
                                title="Edit visit count"
                              >
                                <Hash className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegisterVisitClick(patient)}
                                title="Add visit"
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(patient)}
                                title="Edit patient"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClick(patient.id)}
                                title="Delete patient"
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

      {/* Visit Confirmation Dialog */}
      <Dialog open={showVisitDialog} onOpenChange={setShowVisitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Visit</DialogTitle>
            <DialogDescription>
              Register a new visit for <strong>{visitPatient?.fullName}</strong>
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
                <Label htmlFor="visitDate">Sana (ixtiyoriy)</Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
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
                Cancel
              </Button>
              <Button type="submit">Register Visit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Visit Count Dialog */}
      <Dialog open={showEditVisitDialog} onOpenChange={setShowEditVisitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Visit Count</DialogTitle>
            <DialogDescription>
              Update the visit count for <strong>{visitPatient?.fullName}</strong>. Current count:{' '}
              <strong>{visitPatient?.visitCount}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="visitCount">Visit Count</Label>
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
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateVisitCount}>
              Update Visit Count
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Medical History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>Kasallik tarixi - {visitPatient?.fullName}</DialogTitle>
            <DialogDescription>
              Bemorning barcha kelishlari va kasalliklari ro&apos;yxati
            </DialogDescription>
          </DialogHeader>
          <VisitHistory patientId={visitPatient?.id || ''} patients={patients} />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
    </ProtectedRoute>
  )
}

// Visit History Component
function VisitHistory({ patientId, patients }: { patientId: string; patients: Patient[] }) {
  const patient = patients.find((p) => p.id === patientId)
  const visits = patient?.visits || []
  const isLoading = false
  const error: any = null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
