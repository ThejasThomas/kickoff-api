import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../domain/utils/custom.error";
import { HTTP_STATUS } from "../../../shared/constants";
import { IOwnerWalletRepository } from "../../../domain/repositoryInterface/wallet/ownerWalletRepository_interface";
import { IGetOwnerWalletUseCase } from "../../../domain/useCaseInterfaces/wallet/get_owner_wallet_usecase_interface";

@injectable()
export class GetOwnerWalletUseCase implements IGetOwnerWalletUseCase {
  constructor(
    @inject("IOwnerWalletRepository")
    private walletRepository: IOwnerWalletRepository
  ) {}

  async execute(ownerId: string) {
    const wallet = await this.walletRepository.findByOwnerId(ownerId);

    if (!wallet) {
      throw new CustomError(
        "Wallet not found",
        HTTP_STATUS.NOT_FOUND
      );
    }

    return wallet;
  }
}
