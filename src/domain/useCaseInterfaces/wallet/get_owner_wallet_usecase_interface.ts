import { IOwnerWalletEntity } from "../../models/ownerWalletEntity";

export interface IGetOwnerWalletUseCase {
  execute(ownerId: string): Promise<IOwnerWalletEntity>;
}
