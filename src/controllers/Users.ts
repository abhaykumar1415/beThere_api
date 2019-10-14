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
			let indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
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
							// let today = new Date();
							// var currentDate = today.getDate();
							// var currentMonth = today.getMonth() + 1;
							// console.log('Current date :', currentDate);
							// console.log('Current Month :', currentMonth);
							// if (currentDate === ) {}

							let latestAttendance: any  = data.attendance[attendanceLength - 1];
							let todayDate = new Date(indiaTime).toDateString();
							let thatDate = new Date(latestAttendance.timestamp).toDateString();
							if (todayDate == thatDate) {
								data.attendance = latestAttendance;
								let timeNow = new Date(indiaTime).getHours() + ':' + new Date(indiaTime).getMinutes();
								console.log('timeNow :', timeNow);
								// if ()
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
				// Start
					const returnCurrentDate = () => {
						let indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
						let hrs = new Date(indiaTime).getHours();
						let minutesPre = new Date(indiaTime).getMinutes() < 10 ? true : false;
						let min = new Date(indiaTime).getMinutes();
						let time = minutesPre  ? hrs + ":0" +min  : hrs + ":" + min;
						return time;
					}
			
					const returnAttendanceArray = (status) => {
						console.log(' req.body.wfhReason :', req.body.wfhReason);
						let indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
						let actualStatus = STATUS.PRESENT;
						if (status == STATUS.WFH) {
							actualStatus = STATUS.WFH;
						} else if (status === STATUS.PRESENT) {
							let currentHrs = new Date(indiaTime).getHours();
							let currentMinutes = new Date(indiaTime).getMinutes();
							if (currentHrs <= 11) {
								// if (currentHrs == 10) {
								// 	if (currentMinutes <= 30) {
										actualStatus = STATUS.PRESENT;
									// } else {
									// 	actualStatus = STATUS.LATE;
									// }
								} else {
									actualStatus = STATUS.LATE;
								}
							}
						// }
						let attendance = {
							timestamp: new Date(indiaTime),
							monthNubmer:new Date(indiaTime).getMonth() + 1,
							monthName: new Date(indiaTime).toLocaleDateString('en-US', { month: 'short',timeZone: 'UTC' }),
							year:  new Date(indiaTime).getFullYear(),
							date: new Date(indiaTime).getDate(),
							dayNumber: new Date(indiaTime).getDay(),
							dayName: new Date(indiaTime).toDateString().split(' ')[0],
							time: returnCurrentDate(),
							// status: STATUS.PRESENT === status ?  STATUS.PRESENT : STATUS.WFH === status ? STATUS.WFH : STATUS.LATE
							status: actualStatus,
							wfhReason: req.body.wfhReason ?  req.body.wfhReason : null
						}
						return attendance;
					}
			
					const markAttendance = async (params, status) => {
						console.log('in mark attendance :', status);
						return await UserModel.update(
							params,
							{$push: {attendance: returnAttendanceArray(status)}}
							)
							.then((update) => {
									return { success: true, msg: Greetings.show() };
							})
							.catch((error: Error) => {
								return {success: false, msg: error.message}
						});
					}

				// end
					
				let indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
				try {
					console.log(' req.body :', req.body);
					let isValid = CheckDistance.isValidDistance(req.body.geoLocation.lat, req.body.geoLocation.lng);
					if (req.body.status  && req.body.geoLocation) {
						console.log(' in if 1');
						if (req.body.status.toLocaleLowerCase() === 'present' && isValid ) {
							console.log(' in if 2');
							UserModel
							.findOne(
								req.params,
							)
						.then(async (data: any) => {
							console.log(' in if 3');
								if (!data) {
									throw "User not found.";
								}
								let validRequest = false;
								let attendanceLength = data.attendance.length;
								if (attendanceLength == 0) {
									validRequest = true;
								} else  {
									let latestAttendance: any  = data.attendance[attendanceLength - 1];
									let todayDate = new Date(indiaTime).toDateString();
									let thatDate = new Date(latestAttendance.timestamp).toDateString();
									if (todayDate == thatDate) {
										if (latestAttendance.status === STATUS.WFH ) {
											data.attendance = latestAttendance;
											validRequest = true;
										} else {
											data.attendance = latestAttendance;
											validRequest = false;
										}
									}  else {
										validRequest = true;
									}

								}
								if ( !validRequest ) {
									res.status(200).json({ success : false, data: data, msg: "Your Attendance is already marked for today." });
								} else {
									console.log('this is a valid request');
									let result = await markAttendance(req.params, 'present');
									console.log('result for PRESENT:', result);
									res.status(200).json(result);
								}
							}).catch((error: Error) => {
								res.status(400).json({
										error: error,
								});
								next(error);
						});
					} else if (req.body.status.toLocaleLowerCase() === 'present' && !isValid ) {
							res.status(200).json({
								success: false,
								msg: "Please be in office premises to log attendance.",
							});
						}  else if (req.body.status.toLocaleLowerCase() === 'wfh') {

							//yolo
							let validWFH = false;
							let currentHrs = new Date(indiaTime).getHours();
							let currentMinutes = new Date(indiaTime).getMinutes();
							if ( currentHrs < 10 ) {
								validWFH = true;
							} else if (currentHrs === 10) {
								if ( currentMinutes <= 30) {
									validWFH = true;
								}
							}
							if (validWFH) {
								let result = await markAttendance(req.params, 'wfh');
								console.log('result for WFH:', result);
								res.status(200).json(result);
							} else {
								res.status(200).json({ success: false, msg: "WFH can be marked only before 10:30 am. If you still want to continue working from home please send an email to the HR department with your PM's approval." });
							}
						}
						else {
							throw 'Bad Request';
						}
				} // main if
				else {
					throw 'Bad Request';
				}
			}
			catch (err ) {
				res.status(200).json({
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
