import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ICancelRequestRepository } from "../../../domain/repositoryInterface/booking/cancel_request_repository";
import { CancellationRequestModel, ICancellationRequestModel } from "../../database/mongoDb/models/cancellationrequest_model";
import { ICancellationRequestEntity } from "../../../domain/models/cancellationRequest_entity";

@injectable()
export class CancelrequestRepository extends BaseRepository<ICancellationRequestModel>
implements ICancelRequestRepository {
    constructor(){
        super(CancellationRequestModel)
    }
    async findByBookingId(bookingId: string): Promise<ICancellationRequestEntity | null> {
        return await CancellationRequestModel.findOne({bookingId})
    }
    async createRequest(data: ICancellationRequestEntity): Promise<ICancellationRequestEntity> {
        return await CancellationRequestModel.create(data)
    }
}