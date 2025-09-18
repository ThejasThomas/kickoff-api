import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ITurf } from "../../database/mongoDb/models/turf_model";
import { ISlotModel, SlotModel } from "../../database/mongoDb/models/slot_model";
import { ISlot } from "../../../application/turfs/generate_slots_usecase";

@injectable()

export class SlotRepository extends BaseRepository<ISlotModel>{
    constructor(){
        super(SlotModel)
    }
}