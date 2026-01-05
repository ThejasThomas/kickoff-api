import { inject, injectable } from "tsyringe";
import { IGetWalletHistoryUseCase } from "../../../domain/useCaseInterfaces/wallet/get_walletHistory_usecase";
import { IWalletRepository } from "../../../domain/repositoryInterface/wallet/wallet_repository_interface";
import { IWalletTransactionDTO } from "../../dtos/wallet_transaction_dto";

@injectable()
export class GetWalletHistoryUseCase implements IGetWalletHistoryUseCase {
    constructor(
        @inject("IWalletRepository")
        private _walletRepository:IWalletRepository
    ){}

    async execute(userId: string,page:number,limit:number): Promise<{ transactions: IWalletTransactionDTO[]; total: number }> {
        return await this._walletRepository.getTransactionHistory(userId,page,limit)
    }
}