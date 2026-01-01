import { RevenuePeriod } from "../../models/AdminDashboardEntity";

export interface IAdminDashboardRepository {
    getUsersStats():Promise<{
        total:number;
        active:number;
        blocked:number;
        pending:number;
    }>

    getTurfStats():Promise<{
        total:number;
        approved:number;
        pending:number;
        rejected:number;
    }>

    getOwnerStats():Promise<{
        total:number;
        active:number;
        blocked:number;
        pending:number;
    }>
    getBookingStats():Promise<{
        total:number;
        completed:number;
        confirmed:number;
    }>
    getRevenueAnalytics(period:RevenuePeriod):Promise<{
        totalBalance:number;
        data:{label:string;amount:number}[];
    }>
}