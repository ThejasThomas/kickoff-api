import { inject, injectable } from "tsyringe";
import { IGetAllUsersUseCase } from "../../../domain/useCaseInterfaces/users/get_all_users_usecase_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { ITurfOwnerRepository } from "../../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { IClientEntity } from "../../../domain/models/client_entity";
import { ITurfOwnerEntity } from "../../../domain/models/turfOwner_entity";
import { mapUser } from "../../mappers/getUsersMappers";

@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("ITurfOwnerRepository")
    private _turfOwnerRepository: ITurfOwnerRepository
  ) {}
  async execute(
    userType: "client" | "turfOwner",
    page: number,
    limit: number,
    search: string,
    status: string,
    excludeStatus: string[] = []
  ): Promise<{
    users: (
      | Omit<IClientEntity, "password">
      | Omit<ITurfOwnerEntity, "password">
    )[];
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    } else if (excludeStatus.length > 0) {
      filter.status = { $nin: excludeStatus };
    }
    const sortOptions = { createdAt: -1 };

    const repo =
      userType === "client"
        ? this._clientRepository
        : this._turfOwnerRepository;

    const { items, total } = await repo.findAll(
      filter,
      skip,
      limit,
      sortOptions
    );
    console.log('total',total)

    const sanitizedUsers = items.map(mapUser);
    return {
      users: sanitizedUsers,
      totalPages: Math.ceil(total / limit),
    };
  }
}
