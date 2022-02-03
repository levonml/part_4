import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
	try {
		const user = await User.findOne({ userName: req.body.userName });
		//console.log("userrrrrrrrrrrrrr", user);
		//	console.log("request.body.password", req.body.password);

		const passwordCorrect =
			user === null
				? false
				: await bcrypt.compare(req.body.password, user.password);
		//console.log("passwordCorrect", passwordCorrect);
		if (!(user && passwordCorrect)) {
			return res.status(401).json({
				error: "invalid username or password",
			});
		}
		const userForToken = {
			username: user.userName,
			id: user._id,
		};
		//console.log("userForToken", userForToken);
		const token = jwt.sign(userForToken, process.env.SECRET, {
			expiresIn: 60 * 60,
		});
		//console.log("token genereted !!! ", token);
		res.status(200).send({ token, username: user.userName, name: user.name });
	} catch (err) {
		next(err);
	}
});
export default loginRouter;
