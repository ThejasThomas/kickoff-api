import { inject, injectable } from "tsyringe";
import { IGetAllTurfsUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/get_all_turfs_usecase_interface";
import { ITurfRepository } from "../../domain/repositoryInterface/Turf/turf_repository_interface";
import { ITurfEntity } from "../../domain/models/turf_entity";
@injectable()
export class GetAllTurfsUsecase implements IGetAllTurfsUseCase {
  constructor(
    @inject("ITurfRepository")
    private _turfRepository: ITurfRepository
  ) {}

  async execute(
    page: number,
    limit: number,
    search: string,
    status: string,
    // excludeStatus: string[]=[]
  ): Promise<{ turfs: Omit<ITurfEntity, "ownerId">[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { turfName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        {"location.city":{$regex:search,$options:"i"}}
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }
    // } else if (excludeStatus.length > 0) {
    //   filter.status = { $nin: excludeStatus };
    // }

    const sortOptions = { createdAt: -1 };
    const { items, total } = await this._turfRepository.findAll(
      filter,
      skip,
      limit,
      sortOptions,
    );

    type SanitizedTurf = Omit<ITurfEntity, "ownerId"> & { _id: string };

    const sanitizedTurfs: SanitizedTurf[] = items.map((turf) => {
      const {  id, ...rest } = turf;
      return { _id: (id ?? "").toString(), ...rest } as SanitizedTurf;
    });

    return {
      turfs: sanitizedTurfs,
      totalPages: Math.ceil(total / limit),
    };
  }
}
