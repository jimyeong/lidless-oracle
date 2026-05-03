class ApiError extends Error {
    public status: number;
    public code: string;
    public original?: unknown;
    constructor(
        status: number,
        code: string,
        message: string,
        original?: unknown
    ) {
        super(message)
        this.status = status
        this.code = code
        this.original = original
    }
}
export default ApiError