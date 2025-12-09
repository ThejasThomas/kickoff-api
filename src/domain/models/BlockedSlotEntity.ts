export interface IBlockedSlotEntity{
    id?:string,
    turfId:string,
    date:string,
    startTime:string,
    endTime:string,
    reason?:string,
    createdAt?:Date
}