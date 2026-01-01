import { TurfReviewDTO } from "../../../application/dtos/turf_review_dto";

export interface IGetTurfReviewsUseCase {
  execute(
    turfId: string,
    page: number,
    limit: number
  ): Promise<{
    reviews: TurfReviewDTO[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}
