export class ApiResponse {
    public statusCode: number;
    public data?: Record<any, any>;
    public message: string
    public success: boolean
    constructor(statusCode:number, message: string, data?:Record<any, any>){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}




export class ApiError extends Error {
    public message:string;
    public statusCode:number;
    public success:boolean
    constructor(statusCode:number, message:string, errors?:[], stack = ""){
        super(message)
        this.statusCode = statusCode
        this.message = message;
        this.success = false;
        if (stack) this.stack = stack; else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}