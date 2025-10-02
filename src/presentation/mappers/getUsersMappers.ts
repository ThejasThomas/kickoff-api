import { IClientEntity } from "../../domain/models/client_entity";
import { ITurfOwnerEntity } from "../../domain/models/turfOwner_entity";

type SanitizedUser =
  | (Omit<IClientEntity, "password"> & { _id: string })
  | (Omit<ITurfOwnerEntity, "password"> & { _id: string });

export function mapUser(
  user: IClientEntity | ITurfOwnerEntity
): SanitizedUser {
  const { password, _id, ...rest } = user;
  return { _id: (_id ?? "").toString(), ...rest } as SanitizedUser;
}
