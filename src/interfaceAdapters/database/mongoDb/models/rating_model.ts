import { model } from "mongoose";
import { IRatingEntity } from "../../../../domain/models/rating_entity";
import { RatingSchema } from "../schemas/rating_schema";

export const RatingModel =model<IRatingEntity>("Ratings",RatingSchema);