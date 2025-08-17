import { injectable } from "tsyringe";
import { IEmailService } from "../../entities/serviceInterfaces/email_service_interface";
import { config } from "../../shared/config";
import nodemailer from 'nodemailer'
import chalk from "chalk";
import { PASSWORD_RESET_MAIL_CONTENT, SENT_REJECTION_EMAIL, VERIFICATION_MAIL_CONTENT } from "../../shared/constants";


@injectable()
export class EmailService implements IEmailService {
    private _transporter;

    constructor(){
        this._transporter =nodemailer.createTransport({
            service:'gmail',
            auth: {
                user:config.nodemailer.EMAIL_USER,
                pass:config.nodemailer.EMAIL_PASS
            }
        })
    }
    private async _sendMail(mailOptions: {
		from: string;
		to: string;
		subject: string;
		html: string;
	}) {
		const info = await this._transporter.sendMail(mailOptions);
		console.log(chalk.bgGreenBright.bold(`📧 Email sent:`), info.response);
	}
    async sendOtpEmail(
		to: string,
		subject: string,
		otp: string
	): Promise<void> {
		const mailOptions = {
			from: `"KickOff" <${config.nodemailer.EMAIL_USER}>`,
			to,
			subject,
			html: VERIFICATION_MAIL_CONTENT(otp),
		};
		await this._sendMail(mailOptions);
	}
    async sendResetEmail(
		to: string,
		subject: string,
		resetLink: string
	): Promise<void> {
		const mailOptions = {
			from: `"KickOff" <${config.nodemailer.EMAIL_USER}>`,
			to,
			subject,
			html: PASSWORD_RESET_MAIL_CONTENT(resetLink),
		};
		await this._sendMail(mailOptions);
		console.log(
			chalk.bgYellowBright.bold(
				`🔁 Reset Password Link:`
			),
				chalk.cyanBright.bold(resetLink)
		);
	}
    async sendCustomEmail(
		to: string,
		subject: string,
		content: string
	): Promise<void> {
		const mailOptions = {
			from: `"KickOff" <${config.nodemailer.EMAIL_USER}>`,
			to,
			subject,
			html: content,
		};
		await this._sendMail(mailOptions);
	}

	async sendRejectionEmail(to: string,reason: string,retryUrl: string , entityLabel: string): Promise<void> {
		const subject = `${entityLabel} Application Rejected - KickOff`
		const mailOptions ={
			from:`"KickOff" <${config.nodemailer.EMAIL_USER}>`,
			to,
			subject,
			html:SENT_REJECTION_EMAIL(entityLabel, reason,retryUrl)
			
		}
		await this._sendMail(mailOptions)

		 console.log(
      chalk.bgRedBright.bold(`❌ Rejection Email Sent:`),
      chalk.yellowBright(`${entityLabel} - ${to}`)
    );
		

	}


    
}