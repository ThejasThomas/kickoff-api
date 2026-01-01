import { Request, Response } from "express";

export interface ITurfController {
  getAllTurfs(req: Request, res: Response): Promise<void>;
  getMyTurf(req: Request, res: Response): Promise<void>;
  getTurfById(req: Request, res: Response): Promise<void>;
  updateTurf(req: Request, res: Response): Promise<void>;
  generateSlots(req: Request, res: Response): Promise<void>;
  getSlots(req: Request, res: Response): Promise<void>;
  bookslots(req: Request, res: Response): Promise<void>;
  bookslotsoffline(req:Request,res:Response):Promise<void>
  getnearbyturfs(req: Request, res: Response): Promise<void>;
  addrules(req: Request, res: Response): Promise<void>;
  getrules(req: Request, res: Response): Promise<void>;
  checkIsSlotBooked(req:Request,res:Response):Promise<void>
  cancelSlot(req:Request,res:Response):Promise<void>
  addReview(req:Request,res:Response):Promise<void>
  getTurfReviews(req:Request,res:Response):Promise<void>
  getTurfReviewsForAdmin(req:Request,res:Response):Promise<void>
  deleteReviewAdmin(req:Request,res:Response):Promise<void>
  addRating(req:Request,res:Response):Promise<void>
  getTurfRatings(req:Request,res:Response):Promise<void>
}
