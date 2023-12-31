import { ObjectId } from 'mongodb';
import { UserDto } from 'src/modules/user/dtos';
export interface IPerformerResponse {
    _id?: ObjectId;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    phoneCode?: string;
    status?: string;
    avatar?: string;
    cover?: string;
    idVerificationId?: ObjectId;
    documentVerificationId?: ObjectId;
    gender?: string;
    country?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    address?: string;
    languages?: string[];
    categoryIds?: ObjectId[];
    height?: string;
    weight?: string;
    bio?: string;
    eyes?: string;
    sexualPreference?: string;
    monthlyPrice?: number;
    yearlyPrice?: number;
    stats?: {
        likes?: number;
        subscribers?: number;
        views?: number;
        totalVideos: number;
        totalPhotos: number;
        totalGalleries: number;
        totalProducts: number;
    };
    verifiedEmail?: boolean;
    verifiedAccount?: boolean;
    verifiedDocument?: boolean;
    score?: number;
    isPerformer: boolean;
    bankingInformation?: any;
    ccbillSetting?: any;
    paypalSetting?: any;
    commissionSetting?: any;
    blockCountries?: any;
    createdBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    isOnline?: boolean;
    activateWelcomeVideo?: boolean;
    pubicHair?: string;
    ethnicity?: string;
    bodyType?: string;
    dateOfBirth?: Date;
    butt?: string;
    hair?: string;
}
export interface IBlockedUsersResponse {
    _id?: string | ObjectId;
    userId?: string | ObjectId;
    userInfo?: UserDto;
}
export declare class PerformerDto {
    _id: ObjectId;
    name?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    phone?: string;
    phoneCode?: string;
    status?: string;
    avatarId?: ObjectId;
    avatarPath?: string;
    coverId?: ObjectId;
    coverPath?: string;
    idVerificationId?: ObjectId;
    documentVerificationId?: ObjectId;
    idVerification?: any;
    verifiedEmail?: boolean;
    verifiedAccount?: boolean;
    verifiedDocument?: boolean;
    documentVerification?: any;
    avatar?: any;
    cover?: any;
    gender?: string;
    country?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    address?: string;
    languages?: string[];
    categoryIds?: ObjectId[];
    height?: string;
    weight?: string;
    bio?: string;
    eyes?: string;
    sexualPreference?: string;
    monthlyPrice?: number;
    yearlyPrice?: number;
    stats?: {
        likes?: number;
        subscribers?: number;
        views?: number;
        totalVideos: number;
        totalPhotos: number;
        totalGalleries: number;
        totalProducts: number;
    };
    score?: number;
    isPerformer: boolean;
    bankingInformation?: any;
    ccbillSetting?: any;
    paypalSetting?: any;
    commissionSetting?: any;
    blockCountries?: any;
    createdBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    isOnline?: boolean;
    welcomeVideoId?: ObjectId;
    welcomeVideoPath?: string;
    activateWelcomeVideo?: boolean;
    isSubscribed?: boolean;
    pubicHair?: string;
    ethnicity?: string;
    bodyType?: string;
    dateOfBirth?: Date;
    butt?: string;
    hair?: string;
    constructor(data?: Partial<IPerformerResponse>);
    toResponse(includePrivateInfo?: boolean, isAdmin?: boolean): {
        _id: ObjectId;
        name: string;
        avatar: string;
        cover: string;
        username: string;
        gender: string;
        country: string;
        stats: {
            likes?: number;
            subscribers?: number;
            views?: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
        };
        score: number;
        isPerformer: boolean;
        isOnline: boolean;
        isSubscribed: boolean;
        verifiedAccount: boolean;
    } | {
        ccbillSetting: any;
        commissionSetting: any;
        verifiedEmail: boolean;
        verifiedDocument: boolean;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        phoneCode: string;
        status: string;
        city: string;
        state: string;
        zipcode: string;
        address: string;
        languages: string[];
        categoryIds: ObjectId[];
        idVerificationId: ObjectId;
        documentVerificationId: ObjectId;
        documentVerification: any;
        idVerification: any;
        welcomeVideoId: ObjectId;
        welcomeVideoPath: string;
        activateWelcomeVideo: boolean;
        height: string;
        weight: string;
        bio: string;
        eyes: string;
        hair: string;
        pubicHair: string;
        ethnicity: string;
        bodyType: string;
        dateOfBirth: Date;
        butt: string;
        sexualPreference: string;
        monthlyPrice: number;
        yearlyPrice: number;
        bankingInformation: any;
        blockCountries: any;
        paypalSetting: any;
        createdAt: Date;
        updatedAt: Date;
        _id: ObjectId;
        name: string;
        avatar: string;
        cover: string;
        username: string;
        gender: string;
        country: string;
        stats: {
            likes?: number;
            subscribers?: number;
            views?: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
        };
        score: number;
        isPerformer: boolean;
        isOnline: boolean;
        isSubscribed: boolean;
        verifiedAccount: boolean;
    };
    getName(): string;
    toSearchResponse(): {
        _id: ObjectId;
        name: string;
        avatar: string;
        username: string;
        gender: string;
        country: string;
        stats: {
            likes?: number;
            subscribers?: number;
            views?: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
        };
        score: number;
        isPerformer: boolean;
        verifiedAccount: boolean;
        isOnline: boolean;
    };
    toPublicDetailsResponse(): {
        _id: ObjectId;
        name: string;
        avatar: string;
        cover: string;
        username: string;
        status: string;
        gender: string;
        country: string;
        city: string;
        state: string;
        zipcode: string;
        address: string;
        languages: string[];
        categoryIds: ObjectId[];
        height: string;
        weight: string;
        bio: string;
        eyes: string;
        hair: string;
        pubicHair: string;
        ethnicity: string;
        bodyType: string;
        dateOfBirth: Date;
        butt: string;
        sexualPreference: string;
        monthlyPrice: number;
        yearlyPrice: number;
        stats: {
            likes?: number;
            subscribers?: number;
            views?: number;
            totalVideos: number;
            totalPhotos: number;
            totalGalleries: number;
            totalProducts: number;
        };
        isPerformer: boolean;
        score: number;
        createdAt: Date;
        updatedAt: Date;
        isOnline: boolean;
        welcomeVideoId: ObjectId;
        welcomeVideoPath: string;
        activateWelcomeVideo: boolean;
        isSubscribed: boolean;
        verifiedAccount: boolean;
    };
}
