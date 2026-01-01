export interface IHandlOwnerCancelRequestUseCase{
    execute(requestId:string,action:"approved"|"rejected",userId:string):Promise<{message:string}>
}

