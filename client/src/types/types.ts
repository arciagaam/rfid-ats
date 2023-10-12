export interface IErrorResponse {
    status: number
    data: {
        message: string
        stack: string
    }
    error: string
}

export interface UserProfile {
    fullname: string
    email: string
    role: string
    department: string
    status: string
    idNumber: string
    rfid: string
    birthdate: string
    sex: string
    contactNumber: string
    address: string
}
