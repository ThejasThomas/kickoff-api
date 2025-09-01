import { inject, injectable } from "tsyringe";
import { IAddTurfUseCase } from "../../entities/useCaseInterfaces/turfOwner/add_turf_usecase_interface";
import { ITurfEntity } from "../../entities/models/turf_entity";
import { IValidateOwnerService } from "../../entities/serviceInterfaces/validate_owner_service_interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ITurfRepository } from "../../entities/repositoryInterface/Turf/turf_repository_interface";

@injectable()
export class AddTurfUseCase implements IAddTurfUseCase {
  constructor(
    @inject("ITurfRepository")
    private _turfRepository: ITurfRepository,
    @inject("IValidateOwnerService")
    private _validateOwnerUsecase: IValidateOwnerService
  ) {}

  async execute(turfData: ITurfEntity, ownerId: string): Promise<ITurfEntity> {
    console.log("Received turf data", {
      turfName: turfData.turfName,
      location: turfData.location?.city,
      images: turfData.images?.length,
    });

    try {
      await this._validateOwnerUsecase.ownerExists(ownerId);
      await this._validateOwnerUsecase.findOwner(ownerId);

      const newTurf: ITurfEntity = {
        ...turfData,
        ownerId,
        status: "pending",
        location: {
          ...turfData.location,
          coordinates: {
            type: "Point",
            coordinates: [
              Number(turfData.location.coordinates.coordinates[0]),
              Number(turfData.location.coordinates.coordinates[1]),
            ],
          },
        },
      };

      console.log("Coordinates final check:", 
  turfData.location.coordinates.coordinates,
  typeof turfData.location.coordinates.coordinates[0],
  typeof turfData.location.coordinates.coordinates[1]
);


      const savedTurf = await this._turfRepository.save(newTurf);

      return savedTurf;
    } catch (error) {
      console.error("Error in addturf usecase");

      if (error instanceof CustomError) {
        throw error;
      }

      throw new CustomError(
        ERROR_MESSAGES.TURF_CREATION_FAILED,
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }
}
