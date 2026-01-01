import { injectable } from "tsyringe";
import { IReviewRepository } from "../../../domain/repositoryInterface/Turf/review_repository_interface";
import { IReviewEntity } from "../../../domain/models/review_entity";
import { ReviewModel } from "../../database/mongoDb/models/review_model";

@injectable()

export class ReviewRepository implements IReviewRepository{
    async create(review: IReviewEntity): Promise<IReviewEntity> {
        const created=await ReviewModel.create(review)
        return created.toObject()
    }

    async findByBookingId(bookingId: string): Promise<IReviewEntity | null> {
        
        return ReviewModel.findOne({bookingId}).lean()
    }
    async findByTurfId(turfId: string): Promise<IReviewEntity[]> {
        return ReviewModel.find({turfId}).sort({createdAt:-1}).lean()
    }
    async hasReviewForBooking(bookingId: string): Promise<boolean> {
        const count=await ReviewModel.countDocuments({bookingId})
        return count >0
    }
    async findByBookingIds(bookingIds: string[]): Promise<string[]> {
  const reviews = await ReviewModel.find(
    { bookingId: { $in: bookingIds } },
    { bookingId: 1 }
  ).lean();

  return reviews.map(r => r.bookingId.toString());
}
async findByTurfIdPaginated(turfId: string, page: number, limit: number): Promise<{ reviews: IReviewEntity[]; total: number; }> {
    const skip=(page -1)*limit;

    const [reviews,total] =await Promise.all([
        ReviewModel.find({turfId})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .lean(),

        ReviewModel.countDocuments({turfId})
    ])

    return {reviews,total}
}

async deleteById(reviewId: string): Promise<void> {
    await ReviewModel.findByIdAndDelete(reviewId)
}

}