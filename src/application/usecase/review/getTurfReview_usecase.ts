import { inject, injectable } from "tsyringe";
import { IGetTurfReviewsUseCase } from "../../../domain/useCaseInterfaces/review/get_turf_review_usecase_interface";
import { IReviewRepository } from "../../../domain/repositoryInterface/Turf/review_repository_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { TurfReviewDTO } from "../../dtos/turf_review_dto";

@injectable()
export class GetTurfReviewsUseCase implements IGetTurfReviewsUseCase {
  constructor(
    @inject("IReviewRepository")
    private _reviewRepo: IReviewRepository,
    @inject("IClientRepository")
    private _clientRepo: IClientRepository
  ) {}

  async execute(
    turfId: string,
    page: number,
    limit: number
  ): Promise<{
    reviews: TurfReviewDTO[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { reviews, total } = await this._reviewRepo.findByTurfIdPaginated(
      turfId,
      page,
      limit
    );
    const mapped = await Promise.all(
      reviews.map(async (review) => {
        const user = await this._clientRepo.findbyUserId(review.userId);

        return {
          _id: review._id!.toString(),
          comment: review.comment,
          createdAt: review.createdAt
            ? review.createdAt.toISOString()
            : new Date().toISOString(),
          userName: user?.fullName || "Anonymous",
        };
      })
    );

    return {
      reviews: mapped,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
