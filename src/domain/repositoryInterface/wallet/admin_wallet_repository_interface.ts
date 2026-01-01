import { IAdminWalletEntity } from "../../models/admin_wallet_entity";

export interface IAdminWalletRepository{
    getWallet():Promise<IAdminWalletEntity>
    incrementBalance(amount:number):Promise<void>
    decrementBalance(amount:number):Promise<void>
}