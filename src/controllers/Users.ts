import UserModel from '../models/UserModel';
import * as express from 'express';
import Auth from "../services/JwtToken";
import STATUS from '../services/status';
import CheckDistance from '../services/checkLocation';
class UserController {

    public getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction): void {
			UserModel
				.find({})
				.then((data)=> {
					res.status(200).json({data});
				})
				.catch((error: Error) => {
					res.status(500).json({
						error: error.message,
						errorStack: error.stack
					});
					next(error);
				});
    }

    public getUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
			UserModel
				.findOne(
					req.params,
				)
				.then((data) => {
						res.status(200).json({ data });
				})
				.catch((error: Error) => {
						res.status(500).json({
								error: error.message,
								errorStack: error.stack
						});
						next(error);
				});
		}


    public async updateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
				console.log(' In update USer :', req.body);
				let updatePayload: any = {};
				try {
					let isValid = CheckDistance.isValidDistance(req.body.geoLocation.lat, req.body.geoLocation.lng);
					console.log('isValid  in controller:', isValid);
				if (req.body.status  && req.body.geoLocation) {
					if (req.body.status === 'present' && isValid ) {
						const returnCurrentDate = () => {
							let hrs = new Date().getHours();
							let minutesPre = new Date().getMinutes() < 10 ? true : false;
							let min = new Date().getMinutes();
							let time = minutesPre  ? hrs + ":0" +min  : hrs + ":" + min;
							return time;
						}
						let attendance = {
							timestamp: new Date(),
							monthNubmer:new Date().getMonth() + 1,
							monthName: new Date().toLocaleDateString('en-US', { month: 'short',timeZone: 'UTC' }),
							year:  new Date().getFullYear(),
							date: new Date().getDate(),
							dayNumber: new Date().getDay(),
							dayName: new Date().toDateString().split(' ')[0],
							time: returnCurrentDate(),
							status: STATUS.PRESENT
						}
						UserModel.update(
							req.params,
							{$push: {attendance: attendance}}
							)
							.then((update) => {
									res.status(200).json({ success: true });
							})
							.catch((error: Error) => {
								res.status(500).json({
										error: error.message,
										errorStack: error.stack
								});
								next(error);
						});

					} else {
						throw 'Bad Request';
					}
				} // main if
				else {
					throw 'Bad Request';
				}
			}
			catch (err ) {
				res.status(500).json({
					error: err,
				});
			}

		}

    public createUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
			UserModel
				.findOne({
					email: req.body.email,
				})
				.then( async (data) => {
						if (!data) {
							await postUser(req.body.email);
						} else {
							res.status(200).json({ data });
						}
				})
				.catch((error: Error) => {
						res.status(500).json({
								error: error.message,
								errorStack: error.stack
						});
						next(error);
				});

				const postUser = async (email: String) => {
					UserModel
					.create({
						email: email
					})
					.then( async (data) => {
						// let jwtToken = await Auth.mobileTokenGenerate(req.body.key);
						// res.status(200).json({ data: data, jwt: jwtToken });
						res.status(200).json({ data: data});
					})
					.catch((error: Error) => {
							res.status(500).json({
									error: error.message,
									errorStack: error.stack
							});
							next(error);
					});
				}

		}
		

}

export default new UserController();
