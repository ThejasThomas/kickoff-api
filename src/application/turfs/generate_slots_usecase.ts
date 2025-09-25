import { inject, injectable } from "tsyringe";
import { IGenerateSlotUseCase } from "../../domain/useCaseInterfaces/turfOwner/turfs/generateSlotsUseCase";
import { format,addDays } from "date-fns";
import { ISlotService } from "../../domain/serviceInterfaces/slot_service_interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../domain/utils/custom.error";
export interface ISlot{
    id?:string
    turfId:string,
    ownerId:string,
    date:string,
    duration:number,
    price:number,
    startTime:string,
    endTime:string,
    isBooked?:boolean
}

@injectable()

export class GenerateSlotUseCase implements IGenerateSlotUseCase {
    constructor(
        @inject('ISlotService')
        private _slotService:ISlotService
    ){}

    async execute(turfId: string, ownerId: string, date: string, selectedDate: string, endDate: string, startTime: string, endTime: string, slotDuration: number, price: number): Promise<ISlot[]> {
        if (!turfId || !ownerId) {
      throw new CustomError(ERROR_MESSAGES.INVALID_CREDENTIALS,HTTP_STATUS.BAD_REQUEST);
    }
    if (!startTime || !endTime) {
      throw new Error("Start time and end time are required.");
    }
    if (slotDuration <= 0) {
      throw new Error("Slot duration must be greater than 0.");
    }
    if (price < 0) {
      throw new Error("Price cannot be negative.");
    }
    if (!date && (!selectedDate || !endDate)) {
      throw new Error("Date or date range is required.");
      
    }


        const startHour=parseInt(String(startTime.split(":")[0]));
        const endHour =parseInt(String(endTime.split(":")[0]))


        
        const generatedSlots:ISlot[] =[];

        const generateSlotsForDate = (targetDate:string)=>{
            for(let hour=startHour;hour<endHour;hour++) {
                const slotStart =`${hour.toString().padStart(2,"0")}:00`;
                const slotEnd =`${(hour+slotDuration).toString().padStart(2,"0")}:00`;


                generatedSlots.push({
                    
                    turfId,
                    ownerId,
                    date:targetDate,
                    duration:slotDuration,
                    price,
                    startTime:slotStart,
                    endTime:slotEnd,
                    isBooked:false
                })
            }
        }

        const start =new Date(selectedDate);
        const end = new Date(endDate)

        if(selectedDate && endDate && selectedDate !==endDate){
            const daysDiff =Math.floor((end.getTime() - start.getTime())/(1000*60*60*24));
            for(let i=0;i<=daysDiff;i++){
                const currentDate =format(addDays(start,i),"yyyy-MM-dd");
                generateSlotsForDate(currentDate)
            }
        } else {
            generateSlotsForDate(date)
        }   
        for(const slot of generatedSlots) {
            const exists=await this._slotService
        }

       try {
    const createdSlots = await this._slotService.createSlots(generatedSlots);
    return createdSlots;
} catch (err: any) {
    if (err.code === 11000) {
        throw new CustomError(
            ERROR_MESSAGES.SLOT_ALREADY_EXISTS || "Some slots already exist for this turf/date/time.",
            HTTP_STATUS.CONFLICT
        );
    }
    throw err;
}
    }
}