export interface ErrorResponse {
    status: number
    data: {
        message: string
        stack: string
    }
}
