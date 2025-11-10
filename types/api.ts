export interface Patient {
  id: string
  fullName: string
  birthDate: string
  address: string
  visitCount: number
  createdAt: string
  updatedAt: string
  visits?: Visit[] // Optional visits array
}

export interface CreatePatientPayload {
  fullName: string
  birthDate: string
  address: string
}

export interface UpdatePatientPayload {
  fullName?: string
  birthDate?: string
  address?: string
}

export interface Visit {
  id: string
  patientId: string
  reason: string
  visitDate: string
  createdAt: string
  updatedAt: string
}

export interface CreateVisitPayload {
  reason: string
  visitDate?: string
}

export interface UpdateVisitPayload {
  reason?: string
  visitDate?: string
}

export interface PatientsResponse {
  patients: Patient[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface VisitsResponse {
  visits: Visit[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

