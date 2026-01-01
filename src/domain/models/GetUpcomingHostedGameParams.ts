export interface GetUpcomingHostedGamesParams{
    page:number,
    limit:number,
    search?:string,
    minPrice?:number,
    maxPrice?:number
}