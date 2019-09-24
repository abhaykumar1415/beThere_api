import UserModel from '../models/UserModel';
import * as express from 'express';
import Auth from "../services/JwtToken";
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
    public updateUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
				console.log(' In update USer :', req.body);
				let updatePayload: any = {};
				let attendance = {status: "present"}
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
						console.log('USER CREATED :', data);
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
