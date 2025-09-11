import { UpdateResult } from "mongoose";

export interface IBaseRepository<T> {
  find(filter: any): Promise<T[]>;
  findAll(
    filter: any,
    skip: number,
    limit: number,
    sort?: any
  ): Promise<{ items: T[]; total: number }>;
  findOne(filter: any): Promise<T | null>;
    findById(id: string): Promise<T | null>;

  save(data: Partial<T>): Promise<T>;
  update(filter: any, updateData: Partial<T> | any): Promise<T | null>;
  updateOne(filter: any, updateData: Partial<T> | any): Promise<UpdateResult>; // 👈 added

  delete(filter: any): Promise<T | null>;
  deleteAll(filter: any): Promise<void>;
  countDocuments(filter: any): Promise<number>;
}
