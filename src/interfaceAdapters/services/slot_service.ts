import { ISlotService } from "../../domain/serviceInterfaces/slot_service_interface";
import { ISlot } from "../../application/usecase/turfs/generate_slots_usecase";
import { ISlotEntity } from "../../domain/models/slot_entity";
import { SlotModel } from "../database/mongoDb/models/slot_model";
import { inject, injectable } from "tsyringe";
import { ISlotRepository } from "../../domain/repositoryInterface/Turf/slot_repository_interface";


@injectable()
export class SlotService implements ISlotService{
    constructor(
        // @inject('ITurfRepository')
        // private _turfRepository:ITurfRepository,
        @inject('ISlotRepository')
        private _slotRepository:ISlotRepository
    ){}
    async createSlots(slots: ISlot[]): Promise<ISlotEntity[]> {
        const createdSlots =await SlotModel.create(slots)
        return createdSlots.map((slot)=>({
            id:slot._id.toString(),
            turfId:slot.turfId,
            ownerId:slot.ownerId,
            date:slot.date,
            startTime:slot.startTime,
            endTime:slot.endTime,
            isBooked:slot.isBooked,
            duration:slot.duration,
            price:slot.price,
        }))
    }

    async findByTurfIdAndDate(turfId: string, date: string): Promise<ISlotEntity[]> {
        try{
            const slots = await this._slotRepository.find({
                turfId,
                 date,
            })
            return slots.map((slot)=>({
                
                turfId:slot.turfId,
                ownerId:slot.ownerId,
                date:slot.date,
                duration:slot.duration,
                price:slot.price,
                startTime:slot.startTime,
                endTime:slot.endTime,
                isBooked:slot.isBooked,
            }))
        }catch(error){
            throw new Error(`Failed to fetch slots from database:${error}`)
        }
    }

    
}