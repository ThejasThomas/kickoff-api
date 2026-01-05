import { inject, injectable } from "tsyringe";
import { ICreateChatGroupUseCase } from "../../../domain/useCaseInterfaces/users/create_chat_group_usecase_interface";
import { IChatGroupRepository } from "../../../domain/repositoryInterface/chatgroup/chat_group_repository_interface";
import { IChatGroupDTO } from "../../dtos/chat_group_dto";

@injectable()
export class CreateChatGroupUseCase implements ICreateChatGroupUseCase {
  constructor(
    @inject("IChatGroupRepository")
    private _chatGroupRepo: IChatGroupRepository
  ) {}

  async execute(data: { hostedGameId: string; hostUserId: string; }): Promise<IChatGroupDTO> {
      return this._chatGroupRepo.createGroup({
        hostedGameId:data.hostedGameId,
        name:"KickOff",
        adminId:data.hostUserId,
        members:[data.hostUserId]
      })
  }
}
