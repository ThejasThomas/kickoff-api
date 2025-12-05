import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import {
  BookinModel,
  IBookingModel,
} from "../../database/mongoDb/models/booking_model";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IBookingRepository } from "../../../domain/repositoryInterface/booking/booking_repository_interface";
import { CancellationRequestModel } from "../../database/mongoDb/models/cancellationrequest_model";
import { ICancellationRequestEntity } from "../../../domain/models/cancellationRequest_entity";
import { trusted } from "mongoose";

@injectable()
export class BookingRepository
  extends BaseRepository<IBookingModel>
  implements IBookingRepository
{
  constructor() {
    super(BookinModel);
  }
  async findByTurfIdAndDate(
    turfId: string,
    date: string
  ): Promise<IBookingModel[]> {
    try {
      const bookings = await BookinModel.find({ turfId, date }).exec();
      return bookings;
    } catch (error) {
      console.error("Error fetching boookings by turfId and  date:", error);
      throw new CustomError(
        ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findUpComingByUserId(
    userId: string,
    skip: number,
    limit: number,
    search: string
  ) {
    try {
      const now = new Date();
      const currentDateStr = now.toISOString().split("T")[0];
      const currentTimeStr = `${now
        .getHours()
        .toString()
        .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      const normalizedSearch = (search || "").trim();

      let filter: any = {
        userId,
        $or: [
          { date: { $gt: currentDateStr } },
          { date: currentDateStr, endTime: { $gt: currentTimeStr } },
        ],
      };

      if (normalizedSearch.length > 0) {
        filter = {
          $and: [
            filter,
            {
              $or: [
                { turfName: { $regex: normalizedSearch, $options: "i" } },
                { location: { $regex: normalizedSearch, $options: "i" } },
              ],
            },
          ],
        };
      }

      const total = await BookinModel.countDocuments(filter);
      const bookings = await BookinModel.find(filter)
        .sort({ date: 1, startTime: 1 })
        .skip(skip)
        .limit(limit);

      return { bookings, total };
    } catch (error) {
      console.error("Error fetching upcoming bookings by userId:", error);
      throw new CustomError(
        ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findPastByUserId(userId: string): Promise<IBookingModel[]> {
    try {
      const now = new Date();
      const currentDateStr = now.toISOString().split("T")[0];

      const bookings = await BookinModel.find({
        userId,
        $or: [
          { date: { $lt: currentDateStr } },
          { date: currentDateStr, endTime: { $lt: currentDateStr } },
        ],
      }).exec();
      return bookings;
    } catch (error) {
      throw new CustomError(
        ERROR_MESSAGES.FAILED_TO_FETCH_BOOKINGS,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
   async updateStatus(id: string, status: string): Promise<ICancellationRequestEntity | null> {
    return await CancellationRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }
  async getOwnerRequests(ownerId: string): Promise<ICancellationRequestEntity[]> {
    return await CancellationRequestModel.find({ownerId})
  }
  async updateStatusById(bookingId: string, status: string): Promise<IBookingModel | null> {
    return BookinModel.findByIdAndUpdate(
      bookingId,
      {status},
      {new:true}
    )
  }
}
