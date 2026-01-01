import { inject, injectable } from "tsyringe";
import { IGetTurfRatingsUseCase } from "../../../domain/useCaseInterfaces/ratings/get_turf_ratings_usecase_interface";
import { IRatingRepository } from "../../../domain/repositoryInterface/Turf/rating_repository_interface";
import { ITurfRatingResult } from "../../../domain/models/rating_entity";

@injectable()
export class GetTurfRatingUseCase implements IGetTurfRatingsUseCase{
    constructor(
        @inject("IRatingRepository")
        private _ratingRepository:IRatingRepository
    ){}

    async execute(turfId: string, page: number, limit: number): Promise<ITurfRatingResult> {
        console.log('turrfffIDD',turfId)
        return this._ratingRepository.getTurfRatings(
            turfId,
            page,
            limit
        )
    }
}