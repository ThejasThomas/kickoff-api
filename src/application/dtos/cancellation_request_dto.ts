export interface CancellationRequestDTO {
    bookingId?:string;
    hostedGameId?:string;
    userId:string;
    ownerId:string;
    reason:string;
    status:"pending" | "approved" | "rejected";
    createdAt?:Date;
    updatedAt?:Date;
}
