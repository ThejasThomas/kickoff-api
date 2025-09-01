import { inject, injectable } from "tsyringe";
import { IUpdateEntityStatusUseCase } from "../../entities/useCaseInterfaces/users/update_entity_status_usecase_interface";
import { IClientRepository } from "../../entities/repositoryInterface/users/client-repository.interface";
import { ITurfOwnerRepository } from "../../entities/repositoryInterface/users/turf_owner-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { hasEmail } from "../../shared/helper/hasEmail";
import { ITokenService } from "../../entities/serviceInterfaces/token_service_interface";
import { IEmailService } from "../../entities/serviceInterfaces/email_service_interface";
import { config } from "../../shared/config";
import { ITurfRepository } from "../../entities/repositoryInterface/Turf/turf_repository_interface";

@injectable()
export class UpdateEntityStatusUseCase implements IUpdateEntityStatusUseCase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("ITurfOwnerRepository")
    private _turfOwnerRepository: ITurfOwnerRepository,
    @inject("ITokenService")
    private _tokenService: ITokenService,
    @inject("ITurfRepository")
    private __turfRepository: ITurfRepository,
    @inject("IEmailService")
    private _emailService: IEmailService
  ) {}
  async execute(
    entityType: string,
    entityId: string,
    status: string,
    reason?: string,
    email?: string
  ): Promise<void> {
    if (!entityType || !entityId || !status) {
      throw new CustomError(
        ERROR_MESSAGES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    let repo;
    let entityLabel: string;

    switch (entityType) {
      case "client":
        repo = this._clientRepository;
        entityLabel = "client";
        break;
      case "turfOwner":
        repo = this._turfOwnerRepository;
        entityLabel = "Turf Owner";
        break;
      case "turf":
        repo = this.__turfRepository;
        entityLabel = "turf";
        break;
      default:
        throw new CustomError(
          ERROR_MESSAGES.INVALID_ROLE,
          HTTP_STATUS.BAD_REQUEST
        );
    }
    const entity = await repo.findOne({ _id: entityId });

    if (!entity) {
      throw new CustomError(
        `${entityType} ${ERROR_MESSAGES.USER_NOT_FOUND}`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const previousStatus = entity.status;
    await repo.update({ _id: entityId }, { status });

    if (
      entityType === "turfOwner" &&
      status === "rejected" &&
      reason &&
      hasEmail(entity)
    ) {
      await this._handleRejection(
        entity.email,
        reason,
        entityType,
        entityLabel
      );
    }
  }

  private async _handleRejection(
    email: string,
    reason: string,
    entityType: string,
    entityLabel: string
  ): Promise<void> {
    try {
      let retryUrl: string | null = null;
      if (entityType === "turfOwner") {
        const retryToken = this._tokenService.generateResetToken(email);

        retryUrl = `${config.cors.ALLOWED_ORIGIN}/turf-owner/register?retry_token=${retryToken}`;
      }

      await this._emailService.sendRejectionEmail(
        email,
        reason,
        retryUrl,
        entityLabel
      );
      console.log(`✅ Rejection email sent to ${entityLabel}: ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send rejection email to ${email}:`, error);
    }
  }
}
