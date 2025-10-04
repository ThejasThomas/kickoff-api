export interface GetRulesDTO {
    turfId:string;
    ownerId:string;
    slotDuration:number;
    price:number;
    weeklyRules:{
        [key:string]:{
            startTime:string; endTime:string
        }
    }[];
    exceptions:{date:string}[];
}