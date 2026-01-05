import { inject, injectable } from "tsyringe";
import { IAdminWalletRepository } from "../../../domain/repositoryInterface/wallet/admin_wallet_repository_interface";
import { IGetAdminWalletUseCase } from "../../../domain/useCaseInterfaces/wallet/get_admin_wallet_usecase_interface";
import { IAdminWalletDTO } from "../../dtos/admin_wallet_dto";

@injectable()
export class GetAdminWalletUseCase implements IGetAdminWalletUseCase {
    constructor(
        @inject("IAdminWalletRepository")
        private _walletRepo:IAdminWalletRepository
    ){}

    async execute(): Promise<IAdminWalletDTO> {
        return await this._walletRepo.getWallet()
        console.log('calllled')
    }
}