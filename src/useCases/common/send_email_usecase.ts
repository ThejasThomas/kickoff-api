import { inject, injectable } from "tsyringe";
import { ISendEmailUseCase } from "../../entities/useCaseInterfaces/common/send_email_usecase_interface";
import { IEmailService } from "../../entities/serviceInterfaces/email_service_interface";

@injectable()
export class SendEmailUseCase implements ISendEmailUseCase {
    constructor(
        @inject('IEmailService') private _emailService:IEmailService
    ) {}
    async execute(to: string, subject: string, content: string): Promise<void> {
        await this._emailService.sendCustomEmail(to,subject,content)
    }
}