import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
	//console.log("req---------------", req);
	console.log("res----------------------------", res.send);
	const user = await User.findOne({ userName: req.body.userName });
	console.log("userrrrrrrrrrrrrr", user);
	const passwordCorrect =
		user === null
			? false
			: await bcrypt.compare(req.body.password, user.password);
	if (!(user && passwordCorrect)) {
		return res.status(401).json({
			error: "invalid username or password",
		});
	}
	const userForToken = {
		username: user.userName,
		id: user._id,
	};
	const token = jwt.sign(userForToken, process.env.SECRET, {
		expiresIn: 60 * 60,
	});
	res.status(200).send({ token, username: user.userName, name: user.name });
});
export default loginRouter;
