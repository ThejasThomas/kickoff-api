import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../domain/repositoryInterface/users/client-repository.interface";
import { IPhoneNumberExistenceService } from "../../domain/serviceInterfaces/phonenumber_existense_service_interface";

@injectable()
export class PhoneNumberExistenceService implements IPhoneNumberExistenceService {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
  ) {}

  async phoneNumberExists(phoneNumber: string): Promise<boolean> {
    const [client] = await Promise.all([
      this._clientRepository.findOne({ phoneNumber }),
    ]);
    return Boolean(client);
  }
}
