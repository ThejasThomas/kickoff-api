import { IAdminWalletDTO } from "../../../application/dtos/admin_wallet_dto";

export interface IGetAdminWalletUseCase {
    execute():Promise<IAdminWalletDTO>
}