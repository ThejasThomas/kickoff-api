import { model } from "mongoose";
import { IReviewEntity } from "../../../../domain/models/review_entity";
import { ReviewSchema } from "../schemas/review_schema";

export const ReviewModel =model<IReviewEntity>(
    "Review",
    ReviewSchema
)