import { inject, injectable } from "tsyringe";
import { ITurfRepository } from "../../domain/repositoryInterface/Turf/turf_repository_interface";
import { ITurfEntity } from "../../domain/models/turf_entity";
import { IGetMyTurfsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_my_turf_usecase_interface";
import { mapGetTurfDTO } from "../../presentation/mappers/getTurfMappers";
import { GetTurfDTO } from "../../presentation/dtos/get_turf_dto";

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
    const filter: any = { ownerId }; 

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
    console.log('myTurfs',myturfs[0]._id)
    return {
      turfs: myturfs,
      totalPages: Math.ceil(total / limit),
    };
  }
}