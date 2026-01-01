import { injectable } from "tsyringe";
import { IRatingRepository } from "../../../domain/repositoryInterface/Turf/rating_repository_interface";
import {
  IRatingEntity,
  ITurfRatingResult,
} from "../../../domain/models/rating_entity";
import { RatingModel } from "../../database/mongoDb/models/rating_model";

@injectable()
export class RatingRepository implements IRatingRepository {
  async create(data: Partial<IRatingEntity>): Promise<IRatingEntity> {
    const rating = await RatingModel.create(data);
    return rating.toObject();
  }
  async findByBookingId(bookingId: string): Promise<IRatingEntity | null> {
    return RatingModel.findOne({ bookingId }).lean();
  }
  async findByBookingIds(bookingIds: string[]): Promise<string[]> {
    const ratings = await RatingModel.find(
      { bookingId: { $in: bookingIds } },
      { bookingId: 1, _id: 0 }
    ).lean();
    return ratings.map((rating) => rating.bookingId);
  }
  async getTurfRatings(
    turfId: string,
    page: number,
    limit: number
  ): Promise<ITurfRatingResult> {
    const skip = (page - 1) * limit;
    console.log("turffId", turfId, page, limit);

    const stats = await RatingModel.aggregate([
      { $match: { turfId } },
      {
        $group: {
          _id: "$turfId",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);
    console.log("statsss", stats);

    const ratings = await RatingModel.aggregate([
      { $match: { turfId } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
     
      {
        $lookup: {
          from: "clients",
          localField: "userId",
          foreignField: "userId",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          rating: 1,
          createdAt: 1,
          userName: "$user.fullName",
          _id: 0,
        },
      },
    ]);
    console.log("ratingsss", ratings);
    return {
      averageRating: stats[0]?.averageRating || 0,
      totalRating: stats[0]?.totalRatings || 0,
      ratings,
    };
  }
}
