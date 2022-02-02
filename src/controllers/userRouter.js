import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const userRouter = express.Router();
userRouter.get("/", async (req, res, next) => {
	try {
		const users = await User.find({}).populate("notes", {
			author: 1,
			title: 1,
		});
		res.json(users.map((u) => u.toJSON()));
	} catch (err) {
		next(err);
	}
});
userRouter.post("/", async (req, res, next) => {
	try {
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
		const newUser = new User({
			name: req.body.name,
			userName: req.body.userName,
			password: passwordHash,
		});
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		next(err);
	}
});
userRouter.delete("/", async (req, res, next) => {
	try {
		const users = await User.deleteMany();
		res.json(users);
	} catch (err) {
		next(err);
	}
});
export default userRouter;
