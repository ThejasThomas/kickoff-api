export interface IHandlOwnerCancelRequestUseCase{
    execute(requestId:string,action:"approved"|"rejected"):Promise<{message:string}>
}

