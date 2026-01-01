import { inject, injectable } from "tsyringe";
import { IGetWalletBalanceUseCase } from "../../../domain/useCaseInterfaces/wallet/getWalletBalanceUseCase_interface";
import { IWalletRepository } from "../../../domain/repositoryInterface/wallet/wallet_repository_interface";

@injectable()
export class GetWalletBalanceUseCase implements IGetWalletBalanceUseCase {
    constructor(
        @inject("IWalletRepository")
        private _walletRepository:IWalletRepository
    ){}

    async execute(userId: string): Promise<number> {
        const balance = await this._walletRepository.getBalance(userId)

        return balance
    }
}