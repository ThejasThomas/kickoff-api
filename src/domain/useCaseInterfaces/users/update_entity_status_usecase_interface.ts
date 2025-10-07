export interface IUpdateEntityStatusUseCase{
    execute(entityType:string,entityId:string,status:string,reason?:string,email?:string,ownerId?:string):Promise<void>
}