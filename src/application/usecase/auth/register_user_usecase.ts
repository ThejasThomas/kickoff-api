import { inject, injectable } from "tsyringe";
import { IRegisterUserUseCase } from "../../../domain/useCaseInterfaces/auth/register_usecase_interface";
import { IClientRepository } from "../../../domain/repositoryInterface/users/client-repository.interface";
import { UserDTO } from "../../dtos/user_dto";
import { IClientEntity } from "../../../domain/models/client_entity";
import { IUserExistenceService } from "../../../domain/serviceInterfaces/user_existence_service_interface";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IBcrypt } from "../../../presentation/security/bcrypt_interface";
import { generateUniqueId } from "../../../shared/utils/unique_uuid.helper";
import { ITurfOwnerRepository } from "../../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { ITurfOwnerEntity } from "../../../domain/models/turfOwner_entity";
import { IPhoneNumberExistenceService } from "../../../domain/serviceInterfaces/phonenumber_existense_service_interface";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("ITurfOwnerRepository")
    private _turfOwnerRepository: ITurfOwnerRepository,
    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,
    @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt,
    @inject("IPhoneNumberExistenceService")
    private _phoneNumberExistenceService: IPhoneNumberExistenceService,
  ) {}

  async execute(
    user: UserDTO,
  ): Promise<IClientEntity | ITurfOwnerEntity | null> {
    const { role, email, password } = user;
    const isEmailExisting = await this._userExistenceService.emailExists(email);
    if (isEmailExisting) {
      throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
    }
    if (role === "client" || role === "turfOwner") {
      const phoneNumber = user.phoneNumber;

      if (phoneNumber) {
        const isPhoneExisting =
          await this._phoneNumberExistenceService.phoneNumberExists(
            phoneNumber,
          );

        if (isPhoneExisting) {
          throw new CustomError(
            ERROR_MESSAGES.PHONE_NUMBER_EXISTS,
            HTTP_STATUS.CONFLICT,
          );
        }
      }
    }

    const hashedPassword = password
      ? await this._passwordBcrypt.hash(password)
      : null;

    const userId = generateUniqueId();

    let repository;
    if (role === "client") {
      repository = this._clientRepository;
    } else if (role === "turfOwner") {
      repository = this._turfOwnerRepository;
    } else {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_ROLE,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    return await repository.save({
      ...user,
      password: hashedPassword ?? "",
      userId,
    });
  }
}
