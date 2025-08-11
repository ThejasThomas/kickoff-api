import { injectable } from "tsyringe";
import { IOtpEntity } from "../../../entities/models/otp_entity";
import { IOtpModel, OtpModel } from "../../../frameworks/database/mongoDb/models/otp_model";
import { BaseRepository } from "../base_repository";


@injectable()
export class OtpRepository extends BaseRepository<IOtpModel> {
	constructor() {
		super(OtpModel);
	}
	async findLatestOtp(email: string): Promise<IOtpEntity | null> {
		return this.model.findOne({ email }).sort({ createdAt: -1 }).exec();
	}
}
