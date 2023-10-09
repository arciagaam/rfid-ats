export interface IErrorResponse {
    status: number
    data: {
        message: string
        stack: string
    }
    error: string
}
