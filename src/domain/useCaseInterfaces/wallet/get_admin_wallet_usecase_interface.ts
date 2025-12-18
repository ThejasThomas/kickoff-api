import { IAdminWalletEntity } from "../../models/admin_wallet_entity";

export interface IGetAdminWalletUseCase {
    execute():Promise<IAdminWalletEntity>
}