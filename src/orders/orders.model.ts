import {Schema, Document} from 'mongoose';

export const OrderSchema = new Schema({
    uid: {type: String, required: true},
    quantity: {type: Number, required: true},
    priceEach: {type: Number, required: true},
    status: {type: String, required: true}
})

export interface Order extends Document {
    _id: string;
    uid: string;
    quantity: number;
    priceEach: number;
    status: string;
}