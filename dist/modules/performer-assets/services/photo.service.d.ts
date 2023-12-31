import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { PerformerService } from 'src/modules/performer/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { UserDto } from 'src/modules/user/dtos';
import { CheckPaymentService } from 'src/modules/payment/services';
import { PhotoDto } from '../dtos';
import { PhotoCreatePayload, PhotoUpdatePayload } from '../payloads';
import { GalleryService } from './gallery.service';
import { PhotoModel } from '../models';
export declare const PERFORMER_COUNT_PHOTO_CHANNEL = "PERFORMER_COUNT_PHOTO_CHANNEL";
export declare class PhotoService {
    private readonly performerService;
    private readonly galleryService;
    private readonly subscriptionService;
    private readonly checkPaymentService;
    private readonly photoModel;
    private readonly queueEventService;
    private readonly fileService;
    constructor(performerService: PerformerService, galleryService: GalleryService, subscriptionService: SubscriptionService, checkPaymentService: CheckPaymentService, photoModel: Model<PhotoModel>, queueEventService: QueueEventService, fileService: FileService);
    handleFileProcessed(event: QueueEvent): Promise<void>;
    create(file: FileDto, payload: PhotoCreatePayload, creator?: UserDto): Promise<PhotoDto>;
    updateInfo(id: string | ObjectId, payload: PhotoUpdatePayload, updater?: UserDto): Promise<PhotoDto>;
    setCoverGallery(id: string | ObjectId, updater: UserDto): Promise<PhotoDto>;
    details(id: string | ObjectId, user?: UserDto): Promise<PhotoDto>;
    delete(id: string | ObjectId): Promise<boolean>;
    deleteByGallery(galleryId: string | ObjectId): Promise<boolean>;
    checkAuth(req: any, user: UserDto): Promise<boolean>;
}
