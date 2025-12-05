import { IWalletEntity } from "../../models/wallet_entity";

export interface IGetWalletHistoryUseCase{
    execute(userId:string,page:number,limit:number):Promise<{ transactions: IWalletEntity[]; total: number }>
}
