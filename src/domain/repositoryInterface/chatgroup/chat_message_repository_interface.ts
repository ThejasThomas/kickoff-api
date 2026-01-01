import { IChatMessageEntity } from "../../models/chat_message_entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IChatMessageRepository extends IBaseRepository<IChatMessageEntity> {
  createMessage(message: IChatMessageEntity): Promise<IChatMessageEntity>;
  getMessageByGroupId(groupId: string): Promise<IChatMessageEntity[]>;
  findByIdd(id:string):Promise<IChatMessageEntity|null>
  softDeleteById(id:string):Promise<void>
}
