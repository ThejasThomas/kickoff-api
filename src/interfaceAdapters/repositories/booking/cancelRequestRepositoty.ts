import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ICancelRequestRepository } from "../../../domain/repositoryInterface/booking/cancel_request_repository";
import {
  CancellationRequestModel,
  ICancellationRequestModel,
} from "../../database/mongoDb/models/cancellationrequest_model";
import { ICancellationRequestEntity } from "../../../domain/models/cancellationRequest_entity";
import { BookinModel } from "../../database/mongoDb/models/booking_model";
import { ClientModel } from "../../database/mongoDb/models/client_model";

@injectable()
export class CancelrequestRepository
  extends BaseRepository<ICancellationRequestModel>
  implements ICancelRequestRepository
{
  constructor() {
    super(CancellationRequestModel);
  }
  async findByBookingId(
    bookingId: string
  ): Promise<ICancellationRequestEntity | null> {
    return await CancellationRequestModel.findOne({ bookingId });
  }
  async createRequest(
    data: ICancellationRequestEntity
  ): Promise<ICancellationRequestEntity> {
    return await CancellationRequestModel.create(data);
  }
  async getCancelRequestByOwnerId(
    ownerId: string,
    page:number,
    limit:number
  ): Promise<{requests:ICancellationRequestEntity[];total:number}> {
    const skip=(page-1)*limit;

    const [requests,total] = await Promise.all([
          CancellationRequestModel.find({ownerId})
          .sort({createdAt:-1})
          .skip(skip)
          .limit(limit)
          .lean(),

          CancellationRequestModel.countDocuments({ownerId})
    ])
    
    
    const result = [];

    for (const req of requests) {
      const booking = await BookinModel.findById(req.bookingId).lean();
      const user = await ClientModel.findOne({ userId: req.userId }).lean();

      result.push({
        _id: req._id.toString(),
        bookingId: req.bookingId,
        userId: req.userId,
        ownerId: req.ownerId,
        reason: req.reason,
        status: req.status,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt,

        booking: booking
          ? {
              date: booking.date,
              startTime: booking.startTime,
              endTime: booking.endTime,
              price: booking.price,
              turfId: booking.turfId,
            }
          : null,

        user: user
          ? {
              name: user.fullName,
              email: user.email,
              phone: user.phoneNumber,
            }
          : null,
      });
    }
    console.log("resultttt", result);
    return {requests:result,total};
  }
  async updateStatus(id: string, status: string): Promise<ICancellationRequestEntity | null> {
    return await CancellationRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }
}
