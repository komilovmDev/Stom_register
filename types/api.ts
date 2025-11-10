export interface Patient {
  id: string
  fullName: string
  birthDate: string
  address: string
  visitCount: number
  createdAt: string
  updatedAt: string
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

export interface PatientsResponse {
  patients: Patient[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

