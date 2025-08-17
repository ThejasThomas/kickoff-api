import { email, string } from "zod";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/sent_otp_usecase_interface";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user_existence_service_interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service_interface";
import chalk from "chalk";
import { IBcrypt } from "../../frameworks/security/bcrypt_interface";
import { IEmailService } from "../../entities/serviceInterfaces/email_service_interface";

@injectable()
export class sendOtpEmailUseCase implements ISendOtpEmailUseCase{
    constructor(
        @inject('IOtpService') private __otpService:IOtpService,
        @inject("IUserExistenceService") private _userExistenceService:IUserExistenceService,
        @inject("IOtpBcrypt") private _otpBcrypt: IBcrypt,
        @inject('IEmailService') private _emailService:IEmailService
    ){}

async execute(email:string):Promise<void> {
    const emailExists =await this._userExistenceService.emailExists(email);
    if(emailExists) {
        throw new CustomError(
            ERROR_MESSAGES.EMAIL_EXISTS,
            HTTP_STATUS.CONFLICT
        )
    }
    const otp =this.__otpService.generateOtp()
    console.log(chalk.yellowBright.bold(`OTP:`),
			chalk.greenBright.bold(otp))

        const hashedOtp = await this._otpBcrypt.hash(otp);
        await this.__otpService.storeOtp(email,hashedOtp)
        console.log('otp:',hashedOtp)
        await this._emailService.sendOtpEmail(
            email,
            'KickOff - verify your Email',
            otp
        )
}
}
