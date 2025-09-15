export interface IEmailService {
    sendCustomEmail(to: string,subject:string,contend:string):Promise<void>;
    sendResetEmail(
        to:string,
        subject:string,
        resetLink:string
    ):Promise<void>;
    sendOtpEmail(to:string,subject:string,otp:string):Promise<void>;
    sendRejectionEmail(to:string,subject:string,retryUrl:string|null,entityLabel:string):Promise<void>
    sendApprovalEmail(to:string,entityLabel:string):Promise<void>
    sendTurfRejectionEmail(to:string,reason:string,turfName:string,retryUrl:string):Promise<void>
    sendTurfApprovalEmail(to:string,turfName:string):Promise<void>
}