export interface ISendOtpEmailUseCase {
	execute(email: string,phoneNumber?:string): Promise<void>;
}
