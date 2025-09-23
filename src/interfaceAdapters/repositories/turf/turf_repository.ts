import { injectable } from "tsyringe";
import { BaseRepository } from "../base_repository";
import { ITurf, TurfModel } from "../../database/mongoDb/models/turf_model";
import { ITurfRepository } from "../../../domain/repositoryInterface/Turf/turf_repository_interface";
import { FilterQuery } from "mongoose";

@injectable()
export class TurfRepository extends BaseRepository<ITurf>implements ITurfRepository{
    constructor(){
        super(TurfModel)
    }
    async findNearbyTurfs(latitude: number, longitude: number, maxDistance: number =1000, filter: FilterQuery<[ITurf]>, skip: number=0, limit: number=10, sortOptions: any={createdAt:-1}): Promise<{ items: ITurf[]; total: number; }> {
        const pipeline: any[] = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude], 
          },
          distanceField: "distance",
          maxDistance: maxDistance, 
          spherical: true, 
          query: { ...filter, status: "approved" }, 
        },
      },
      {
        $sort: sortOptions,
      },
    ];

    const [result] = await TurfModel.aggregate([
      ...pipeline,
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ]).exec();
        const items = result.items || [];
    const total = result.total[0]?.count || 0;
        return {items,total}
    }

  //   async findAll(filter: FilterQuery<ITurf>, skip: number, limit: number, sort: any): Promise<{ items: ITurf[]; total: number; }> {
  //       const [items, total] = await Promise.all([
  //     TurfModel.find(filter).skip(skip).limit(limit).sort(sort).exec(),
  //     TurfModel.countDocuments(filter).exec(),
  //   ]);
  //   return { items, total };
  // }
    }

