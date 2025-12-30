export interface IDeleteChatMessageUseCase {
    execute(messageId:string,userId:string):Promise<void>
}
