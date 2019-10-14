import * as connections from '../config/connection';
import { Schema, Document } from 'mongoose';
import Status from '../services/status';
/**
 * @export
 * @interface IUserModel
 * @extends {Document}
 */
export interface IUserModel extends Document {
    createdAt ? : Date;
    updatedAt ? : Date;
    name: string;
    email: string;
}

const UserSchema: Schema = new Schema({
	email: {
		type: String,
		required: true
	},
	attendance: [
		{
			timestamp: {
				type: Date,
				default: new Date()
			},
			monthNubmer: {
				type: String,
				default: new Date().getMonth() + 1
			},
			monthName: {
				type: String,
				default: new Date().toLocaleDateString('en-US', { month: 'short',timeZone: 'UTC' })
			},
			year: {
				type: String,
				default: new Date().getFullYear()
			},
			date: {
				type: String,
				default: new Date().getDate()
			},
			dayNumber: {
				type: String,
				default: new Date().getDay()
			},
			dayName: {
				type: String,
				default: new Date().toDateString().split(' ')[0]
			},
			time: {
				type: String,
				default: new Date().getHours() + ":" + new Date().getMinutes()
			},
			status: {
				type: String,
				default: Status.PRESENT
			},
			wfhReason: {
				type: String,
				default: null
			}

		}
	],
}, {
    collection: 'User',
    versionKey: false,
    timestamps: true
});

export default connections.db.model < IUserModel >('UserModel', UserSchema);
