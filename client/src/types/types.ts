export interface IErrorResponse {
    status: number
    data: {
        message: string
        stack: string
    }
    error: string
}

export interface IUser {
    _id: string
    firstName: string
    middleName?: string
    lastName: string
}

export interface IUserSelect extends IUser {
    key: string
    label: string
    value: string
}

export interface IUserProfile {
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
