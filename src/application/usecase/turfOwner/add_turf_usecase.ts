import { inject, injectable } from "tsyringe";
import { IAddTurfUseCase } from "../../../domain/useCaseInterfaces/turfOwner/add_turf_usecase_interface";
import { ITurfRepository } from "../../../domain/repositoryInterface/Turf/turf_repository_interface";
import { IValidateOwnerService } from "../../../domain/serviceInterfaces/validate_owner_service_interface";
import { ITurfEntity } from "../../../domain/models/turf_entity";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { ITurfResponseDTO } from "../../dtos/turf_dto_response";


@injectable()
export class AddTurfUseCase implements IAddTurfUseCase {
  constructor(
    @inject("ITurfRepository")
    private _turfRepository: ITurfRepository,
    @inject("IValidateOwnerService")
    private _validateOwnerUsecase: IValidateOwnerService
  ) {}

  async execute(turfData: ITurfEntity, ownerId: string): Promise<ITurfResponseDTO> {
  

    try {
      await this._validateOwnerUsecase.ownerExists(ownerId);
      await this._validateOwnerUsecase.ownerActive(ownerId)
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
