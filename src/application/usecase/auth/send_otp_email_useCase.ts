import { ISendOtpEmailUseCase } from "../../../domain/useCaseInterfaces/auth/sent_otp_usecase_interface";
import { IUserExistenceService } from "../../../domain/serviceInterfaces/user_existence_service_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { inject, injectable } from "tsyringe";
import { IOtpService } from "../../../domain/serviceInterfaces/otp-service_interface";
import chalk from "chalk";
import { IBcrypt } from "../../../presentation/security/bcrypt_interface";
import { IEmailService } from "../../../domain/serviceInterfaces/email_service_interface";
import { IPhoneNumberExistenceService } from "../../../domain/serviceInterfaces/phonenumber_existense_service_interface";

@injectable()
export class sendOtpEmailUseCase implements ISendOtpEmailUseCase {
  constructor(
    @inject("IOtpService") private __otpService: IOtpService,
    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,
    @inject("IOtpBcrypt") private _otpBcrypt: IBcrypt,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("IPhoneNumberExistenceService")
    private _phoneNumberExistenceService: IPhoneNumberExistenceService,
  ) {}

  async execute(email: string, phoneNumber?: string): Promise<void> {
    const emailExists = await this._userExistenceService.emailExists(email);
    if (emailExists) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
    }
    if (phoneNumber) {
      const phoneExists =
        await this._phoneNumberExistenceService.phoneNumberExists(phoneNumber);

      if (phoneExists) {
        throw new CustomError(
          ERROR_MESSAGES.PHONE_NUMBER_EXISTS,
          HTTP_STATUS.CONFLICT,
        );
      }
    }
    const otp = this.__otpService.generateOtp();
    console.log(chalk.yellowBright.bold(`OTP:`), chalk.greenBright.bold(otp));

    const hashedOtp = await this._otpBcrypt.hash(otp);
    await this.__otpService.storeOtp(email, hashedOtp);
    await this._emailService.sendOtpEmail(
      email,
      "KickOff - verify your Email",
      otp,
    );
  }
}
