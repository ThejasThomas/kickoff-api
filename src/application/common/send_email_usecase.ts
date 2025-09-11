import { inject, injectable } from "tsyringe";
import { ISendEmailUseCase } from "../../domain/useCaseInterfaces/common/send_email_usecase_interface";
import { IEmailService } from "../../domain/serviceInterfaces/email_service_interface";

@injectable()
export class SendEmailUseCase implements ISendEmailUseCase {
    constructor(
        @inject('IEmailService') private _emailService:IEmailService
    ) {}
    async execute(to: string, subject: string, content: string): Promise<void> {
        await this._emailService.sendCustomEmail(to,subject,content)
    }
}