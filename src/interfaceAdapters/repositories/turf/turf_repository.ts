import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ITurf } from "../../../frameworks/database/mongoDb/models/turf_model";

@injectable()
export class TurfRepository extends BaseRepository<ITurf>{

}