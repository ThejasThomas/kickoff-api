import { inject, injectable } from "tsyringe";
import { IDeleteReviewUseCase } from "../../../domain/useCaseInterfaces/review/deleteReviewUseCase_interface";
import { IReviewRepository } from "../../../domain/repositoryInterface/Turf/review_repository_interface";

@injectable()
export class DeleteReviewUseCase implements IDeleteReviewUseCase{
    constructor(
        @inject("IReviewRepository")
        private _reviewRepo:IReviewRepository
    ){}

    async execute(reviewId: string): Promise<void> {
        await this._reviewRepo.deleteById(reviewId)
    }
}