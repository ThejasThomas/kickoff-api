export interface MembersInfo{
    userId:string,
    fullName:string,
    email:string
}

export interface IChatGroupMembersEntity{
    _id:string,
    name:string,
    hostedGameId:string,
    adminId:string,
    members:string[]
    membersInfo:MembersInfo[]
    createdAt?:Date
}