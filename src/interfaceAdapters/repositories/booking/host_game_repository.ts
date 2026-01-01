import { injectable } from "tsyringe";
import { IHostedGameRepository } from "../../../domain/repositoryInterface/booking/hosted_game_repository_interface";
import { BaseRepository } from "../base_repository";
import { IHostedGameEntity } from "../../../domain/models/hosted_game_entity";
import { HostedGameModel } from "../../database/mongoDb/schemas/hosted_game_schema";
import { IHostedGameItem } from "../../../domain/models/get_hosted_game_entity";
import { TurfModel } from "../../database/mongoDb/models/turf_model";
import { ClientModel } from "../../database/mongoDb/models/client_model";
import { CustomError } from "../../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { GetUpcomingHostedGamesParams } from "../../../domain/models/GetUpcomingHostedGameParams";
import { ICancellationRequestEntity } from "../../../domain/models/cancellationRequest_entity";
import { CancellationRequestModel } from "../../database/mongoDb/models/cancellationrequest_model";

@injectable()
export class HostGameRepository
  extends BaseRepository<IHostedGameEntity>
  implements IHostedGameRepository
{
  constructor() {
    super(HostedGameModel);
  }
  async createGame(data: IHostedGameEntity): Promise<IHostedGameEntity> {
    return await HostedGameModel.create(data);
  }
  async getById(id: string): Promise<IHostedGameEntity | null> {
    return await HostedGameModel.findById(id);
  }
  async findbyTurfIdAndDate(
    turfId: string,
    slotDate: string
  ): Promise<IHostedGameEntity[]> {
    return HostedGameModel.find({
      turfId,
      slotDate,
      status: { $in: ["open", "full"] },
    });
  }
  async getUpComingGames(
    params: GetUpcomingHostedGamesParams
  ): Promise<IHostedGameItem[]> {
    try {
    const {page,limit,search,minPrice,maxPrice}=params;
      const today = new Date();
      console.log("today", today);
      const todayStr = today.toISOString().split("T")[0];
      const nowTime = today.toTimeString().slice(0, 5);
      console.log("todayyystr", todayStr);
      console.log("nowwTime", nowTime);
      const now = new Date();

      let turfIds: any[] = [];

      if (search) {
        const turfs = await TurfModel.find({
          $or: [
            { turfName: { $regex: search, $options: "i" } },
            { "location.address": { $regex: search, $options: "i" } },
            { "location.city": { $regex: search, $options: "i" } },
            { "location.state": { $regex: search, $options: "i" } },
          ],
        }).select("_id");
        turfIds = turfs.map((t) => t._id);
        if (turfIds.length === 0) return [];
      }

      const gameFilter: any = {
        status: { $in: ["open", "full"] },
        gameStartAt: { $gt: now },
      };

      if (turfIds.length) {
        gameFilter.turfId = { $in: turfIds };
      }

      if (minPrice || maxPrice) {
        gameFilter.pricePerPlayer = {
          ...(minPrice && { $gte: minPrice }),
          ...(maxPrice && { $lte: maxPrice }),
        };
      }

      const skip = (page - 1) * limit;

      const games = await HostedGameModel.find(gameFilter)
        .sort({ gameStartAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      if (!games.length) return [];

      const result: IHostedGameItem[] = [];
      console.log("resultttt", result);
      for (const game of games) {
        const turf = await TurfModel.findById(game.turfId).lean();

        const hostUser = await ClientModel.findOne({
          userId: game.hostUserId,
        }).lean();

        const playersWithUser: IHostedGameItem["players"] = [];

        for (const player of game.players || []) {
          const playerUser = await ClientModel.findOne({
            userId: player.userId,
          }).lean();

          playersWithUser.push({
            userId: player.userId,
            status: player.status,
            joinedAt: player.joinedAt
              ? new Date(player.joinedAt).toISOString()
              : undefined,

            user: playerUser
              ? {
                  name: playerUser.fullName,
                  email: playerUser.email,
                  phoneNumber: playerUser.phoneNumber,
                }
              : null,
          });
        }

        result.push({
          _id: game._id.toString(),

          hostUserId: game.hostUserId,
          turfId: game.turfId,
          courtType: game.courtType,

          slotDate: game.slotDate,
          startTime: game.startTime,
          endTime: game.endTime,

          pricePerPlayer: game.pricePerPlayer,
          capacity: game.capacity,
          status: game.status,

          players: playersWithUser,

          createdAt: game.createdAt
            ? new Date(game.createdAt).toISOString()
            : new Date().toISOString(),

          updatedAt: game.updatedAt
            ? new Date(game.updatedAt).toISOString()
            : new Date().toISOString(),

          turf: turf
            ? {
                turfName: turf.turfName,
                location: turf.location,
                images: turf.images,
              }
            : undefined,

          hostUser: hostUser
            ? {
                name: hostUser.fullName,
                email: hostUser.email,
                phoneNumber: hostUser.phoneNumber,
              }
            : undefined,
        });
      }

      return result;
    } catch (err) {
      console.error("❌ getUpComingGames repository error:", err);
      return [];
    }
  }
  async joinGame(gameId: string, userId: string): Promise<boolean> {
    const game = await HostedGameModel.findById(gameId);

    if (!game) {
      throw new CustomError(
        ERROR_MESSAGES.NOT_GAME_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    if (!game.players) {
      game.players = [];
    }
    const alreadyJoined = game.players.some(
      (player) => player.userId === userId
    );

    if (alreadyJoined) return false;

    game.players?.push({
      userId,
      status: "paid",
    });

    if (game.players?.length >= game.capacity) {
      game.status = "full";
    }

    await game.save();
    return true;
  }
  async getHostedGameById(id: string): Promise<IHostedGameItem | null> {
    const game = await HostedGameModel.findById(id).lean();
    if (!game) return null;

    const turf = await TurfModel.findById(game.turfId).lean();
    const hostUser = await ClientModel.findOne({
      userId: game.hostUserId,
    }).lean();

    const playersWithUser = [];

    for (const player of game.players || []) {
      const playerUser = await ClientModel.findOne({
        userId: player.userId,
      }).lean();

      playersWithUser.push({
        userId: player.userId,
        status: player.status,
        joinedAt: player.joinedAt,
        user: playerUser
          ? {
              name: playerUser.fullName,
              email: playerUser.email,
              phoneNumber: playerUser.phoneNumber,
            }
          : null,
      });
    }

    return {
      _id: game._id.toString(),
      hostUserId: game.hostUserId,
      turfId: game.turfId,
      courtType: game.courtType,
      slotDate: game.slotDate,
      startTime: game.startTime,
      endTime: game.endTime,
      pricePerPlayer: game.pricePerPlayer,
      capacity: game.capacity,
      status: game.status,
      players: playersWithUser,

      createdAt: game.createdAt
        ? new Date(game.createdAt).toISOString()
        : new Date().toISOString(),

      updatedAt: game.updatedAt
        ? new Date(game.updatedAt).toISOString()
        : new Date().toISOString(),

      turf: turf
        ? {
            turfName: turf.turfName,
            location: turf.location,
            images: turf.images,
          }
        : undefined,

      hostUser: hostUser
        ? {
            name: hostUser.fullName,
            email: hostUser.email,
            phoneNumber: hostUser.phoneNumber,
          }
        : undefined,
    };
  }
  async findByTurfAndDateForOwner(
    turfId: string,
    date: string
  ): Promise<IHostedGameEntity[]> {
    return HostedGameModel.find({
      turfId,
      slotDate: date,
      status: { $in: ["open", "full", "completed"] },
    }).lean();
  }
  async findBySlot(
    turfId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<IHostedGameEntity | null> {
    const normalizedstartTime = normalizeTime(startTime);
    const normalizedendtime = normalizeTime(endTime);

    const hostedGame = await HostedGameModel.findOne({
      turfId: turfId,
      slotDate: date,
      startTime: normalizedstartTime,
      endTime: normalizedendtime,
      status: { $ne: "cancelled" },
    });
    if (!hostedGame) return null;

    return hostedGame;
  }
  async findUpComingByUser(userId: string, skip: number, limit: number, search?: string): Promise<{ games: IHostedGameEntity[]; total: number; }> {
    const now=new Date()
    const filter:any ={
      gameStartAt:{$gt:now},
      $or:[
        {hostUserId:userId},
        {"players.userId":userId},
      ]
    }
    if(search?.trim()){
      filter.$and =[
        {
          $or:[
            {courtType:{$regex:search,$options:"i"}},
            {turfId:{$regex:search,$options:"i"}}
          ]
        }
      ]
    }

    const total =await HostedGameModel.countDocuments(filter);

    const games =await HostedGameModel.find(filter)
    .sort({gameStartAt:1})
    .skip(skip)
    .limit(limit)

    return {games,total}
  }
  async updateStatusById(hostedGameId: string, status: "open" | "full" | "pending_cancel" | "cancelled" | "completed"): Promise<void> {
    await HostedGameModel.findByIdAndUpdate(hostedGameId,{
      status
    })
  }
  async updateStatus(hostedGameId: string, status: string): Promise<ICancellationRequestEntity | null> {
    return await CancellationRequestModel.findByIdAndUpdate(
          hostedGameId,
          { status },
          { new: true }
        );
  }
}
const normalizeTime = (time: string): string => {
  const [hourStr, period] = time.split(" ");
  let hour = parseInt(hourStr, 10);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour.toString().padStart(2, "0") + ":00";
};
