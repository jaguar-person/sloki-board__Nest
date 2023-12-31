import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class PerformerBlockUserModel extends Document {
    source: string;
    sourceId: ObjectId;
    reason: string;
    target: string;
    targetId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
