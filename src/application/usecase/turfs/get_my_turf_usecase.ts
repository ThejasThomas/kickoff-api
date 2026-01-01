import { inject, injectable } from "tsyringe";
import { ITurfRepository } from "../../../domain/repositoryInterface/Turf/turf_repository_interface";
import { IGetMyTurfsUseCase } from "../../../domain/useCaseInterfaces/turfOwner/turfs/get_my_turf_usecase_interface";
import { mapGetTurfDTO } from "../../mappers/getTurfMappers";
import { GetTurfDTO } from "../../dtos/get_turf_dto";

@injectable()
export class GetMyTurfsUseCase implements IGetMyTurfsUseCase {
  constructor(
    @inject("ITurfRepository")
    private _turfRepository: ITurfRepository
  ) {}


  async execute(
    ownerId: string,
    page: number,
    limit: number,
    search: string = "",
    status?: string
  ): Promise<{ turfs: GetTurfDTO[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = { ownerId };

    if (search) {
      filter.$or = [
        { turfName: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const sortOptions = { createdAt: -1 };
    const { items, total } = await this._turfRepository.findAll(
      filter,
      skip,
      limit,
      sortOptions,
    );
    console.log('itmes',items)

    const myturfs = items.map(mapGetTurfDTO);
    if (myturfs.length === 0 && total === 0) {
      console.log('No turfs found for filter:', filter);
    }
    return {
      turfs: myturfs,
      totalPages: Math.ceil(total / limit),
    };
  }
}