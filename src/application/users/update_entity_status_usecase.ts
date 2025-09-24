import { inject, injectable } from "tsyringe";
import { IUpdateEntityStatusUseCase } from "../../domain/useCaseInterfaces/users/update_entity_status_usecase_interface";
import { IClientRepository } from "../../domain/repositoryInterface/users/client-repository.interface";
import { ITurfOwnerRepository } from "../../domain/repositoryInterface/users/turf_owner-repository.interface";
import { CustomError } from "../../domain/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { hasEmail } from "../../shared/helper/hasEmail";
import { ITokenService } from "../../domain/serviceInterfaces/token_service_interface";
import { IEmailService } from "../../domain/serviceInterfaces/email_service_interface";
import { config } from "../../shared/config";
import { ITurfRepository } from "../../domain/repositoryInterface/Turf/turf_repository_interface";
import { ITurf } from "../../interfaceAdapters/database/mongoDb/models/turf_model";

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
    email?: string,
    ownerId?:string
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

    // const previousStatus = entity.status;
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
    if (
      entityType === "turfOwner" &&
      status === "approved" &&
      hasEmail(entity)
    ) {
      await this._handleApproval(

        entity.email,
        entityType,
        entityLabel
      );
    }

    if(entityType ==="turf" && ownerId) {
      const turfEntity =entity as ITurf;
      await this._handleTurfStatusUpdate(
        ownerId,
        status,
        reason||"",
        turfEntity.turfName||"Your Turf",
        entityId
      )
    }

  }

  private async _handleTurfStatusUpdate(
      ownerId:string,
      status:string,
      reason:string,
      turfName:string,
      turfId:string
    ):Promise<void> {
      try{
        const owner =await this._turfOwnerRepository.findOne({userId:ownerId})
        if(!owner || !hasEmail(owner)) {
          console.log(`owner not found or has no email for ID:${ownerId}`);
          return;
        }

        if(status==='rejected' && reason) {
          await this._handleTurfRejection(
            owner.email,
            reason,
            turfName||"Your turf",
            turfId
          )
        }

      }catch(error){
        console.error(`❌ Failed to handle turf status update for owner ${ownerId}:`,error)
        return;
      }
    }

    private async _handleTurfRejection(
      email:string,
      reason:string,
      turfName:string,
      turfId:string
    ):Promise<void> {
      try{
        const retryToken = this._tokenService.generateResetToken(email);
        const retryUrl = `${config.cors.ALLOWED_ORIGIN}/turfOwner/retryedit-turf/${turfId}?retry_token=${retryToken}`;
        await this._emailService.sendTurfRejectionEmail(email,reason,turfName,retryUrl)
              console.log(`✅ Turf rejection email sent to: ${email} for turf: ${turfName}`);

      }catch(error){
        console.error(`❌ Failed to send turf rejection email to ${email}:`, error)
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

        retryUrl = `${config.cors.ALLOWED_ORIGIN}/turfOwner/request-updatedpage?retry_token=${retryToken}`;
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

  private async _handleApproval(
    email: string,
    entityType: string,
    entityLabel: string
  ): Promise<void> {
    try {

      // let retryUrl: string | null = null;
      // if (entityType === "turfOwner") {
      //   const retryToken = this._tokenService.generateResetToken(email);

      //   retryUrl = `${config.cors.ALLOWED_ORIGIN}/turfOwner/request-updatedpage?retry_token=${retryToken}`;
      // }
      

      await this._emailService.sendApprovalEmail(
        email,
        // reason,
        // retryUrl,
        entityLabel
      );


      console.log(`✅ Approval email sent to ${entityLabel}: ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send Approval email to ${email}:`, error);
    }
  }

  
}
