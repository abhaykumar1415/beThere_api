import UserModel from '../models/UserModel';
import * as express from 'express';
import Auth from "../services/JwtToken";
import STATUS from '../services/status';
import CheckDistance from '../services/checkLocation';
import Greetings from '../services/greetings';
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

    public meToday(req: express.Request, res: express.Response, next: express.NextFunction): void {
			try {
			UserModel
				.findOne(
					req.params,
				)
				.then((data: any) => {
						if (!data) {
							throw "User not found.";
						}
						let attendanceLength = data.attendance.length;
						if ( attendanceLength == 0) {
							res.status(200).json({ attendanceMarked : false, data: data });
						} else {
							let latestAttendance: any  = data.attendance[attendanceLength - 1];
							let todayDate = new Date().toDateString();
							let thatDate = new Date(latestAttendance.timestamp).toDateString();
							if (todayDate == thatDate) {
								data.attendance = latestAttendance;
								res.status(200).json({ attendanceMarked : true, data: data });
							} else {
								data.attendance = [];
								res.status(200).json({ attendanceMarked : false, data: data });
							}
						}
				}).catch((error: Error) => {
					res.status(200).json({
							error: error,
					});
					next(error);
			});
			}
			catch(error) {
				res.status(200).json({
					error: error
			});
			}
		}


    public async updateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
				let updatePayload: any = {};
				try {
					let isValid = CheckDistance.isValidDistance(req.body.geoLocation.lat, req.body.geoLocation.lng);
				if (req.body.status  && req.body.geoLocation) {
					if (req.body.status.toLocaleLowerCase() === 'present' && isValid ) {
						UserModel
						.findOne(
							req.params,
						)
						.then((data: any) => {
								if (!data) {
									throw "User not found.";
								}
								let validRequest = false;
								let attendanceLength = data.attendance.length;
								if (attendanceLength == 0) {
									validRequest = true;
								} else  {
									let latestAttendance: any  = data.attendance[attendanceLength - 1];
									let todayDate = new Date().toDateString();
									let thatDate = new Date(latestAttendance.timestamp).toDateString();
									if (todayDate == thatDate) {
										data.attendance = latestAttendance;
										validRequest = false;
									}  else {
										validRequest = true;
									}

								}
								if (!validRequest) {
									res.status(200).json({ success : false, data: data });
								} else {




									// data.attendance = [];
									// res.status(200).json({ attendanceMarked : false, data: data });
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
												res.status(200).json({ success: true, msg: Greetings.show() });
										})
										.catch((error: Error) => {
											res.status(200).json({
													success: false,
													msg: error.message,
													errorStack: error.stack
											});
											next(error);
									});



									
								}
							}).catch((error: Error) => {
								res.status(400).json({
										error: error,
								});
								next(error);
						});









				

					} else {
						if (!isValid) {
							res.status(200).json({
								success: false,
								msg: "Please be in office premises to log attendance.",
							});
						} else {
							throw 'Bad Request';
						}
					}
				} // main if
				else {
					throw 'Bad Request';
				}
			}
			catch (err ) {
				res.status(500).json({
					success: false,
					msg: err,
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
