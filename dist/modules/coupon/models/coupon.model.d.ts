import { Document } from 'mongoose';
export declare class CouponModel extends Document {
    name: string;
    description: string;
    code: string;
    value: number;
    expiredDate: string | Date;
    status: string;
    numberOfUses: number;
    createdAt: Date;
    updatedAt: Date;
}
