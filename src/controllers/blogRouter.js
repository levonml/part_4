import express from "express";
import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import middlewear from "../utils/middlewears.js";
import jwt from "jsonwebtoken";

const blogRouter = express.Router();
blogRouter.get("/", async (request, response, next) => {
	try {
		const blogs = await Blog.find({}).populate("user", {
			name: 1,
			userName: 1,
		});
		response.json(blogs);
	} catch (err) {
		next(err);
	}
});
blogRouter.get("/:id", async (request, response, next) => {
	try {
		const singleList = await Blog.findById(request.params.id);
		response.status(200).json(singleList);
	} catch (err) {
		next(err);
	}
});

blogRouter.post(
	"/",
	middlewear.userExtractor,
	async (request, response, next) => {
		try {
			//const decodedToken = request.token
			//	? jwt.verify(request.token, process.env.SECRET)
			//	: null;
			//if (!decodedToken || !decodedToken.id) {
			//	return response.status(401).json({ error: "token missing or invalid" });
			//}
			const user = request.user;
			console.log("user from middlewear = ", user);
			//const user = await User.findById(decodedToken.id);
			//if (!user) {
			//	return response.status(401).json({ error: "token is invalid" });
			//}
			let blog = new Blog({
				author: request.body.author,
				title: request.body.title,
				user: user._id,
			});
			const saved_blog = await blog.save();
			user.notes = user.notes.concat(saved_blog._id);
			response.status(201).json(saved_blog).end();
			const u = new User({
				userName: user.userName,
				name: user.name,
				notes: user.notes,
			});
			console.log("user is", u);
			await u.save();
			console.log("new useeeer", u);
		} catch (err) {
			next(err);
		}
	}
);
blogRouter.delete("/", async (request, response, next) => {
	try {
		let blog = await Blog.deleteMany();
		response.status(204).json(blog);
	} catch (err) {
		next(err);
	}
});
blogRouter.delete(
	"/:id",
	middlewear.userExtractor,
	async (request, response, next) => {
		try {
			let note = await Blog.findById(request.params.id);
			if (!note) {
				return response.status(400).json({ error: "bed request" });
			}
			let user_id =
				note.user.toString() === request.user.id.toString()
					? note.user.toString()
					: null;
			let return_value = user_id
				? await Blog.findByIdAndRemove(request.params.id)
				: null;
			if (return_value) {
				response.status(204).json(return_value);
			} else {
				response
					.status(401)
					.json({ error: "could not ramove: no permissions" });
			}
		} catch (err) {
			next(err);
		}
	}
);
blogRouter.put("/:id", async (request, response, next) => {
	try {
		let blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
			new: true,
		});
		response.status(201).json(blog);
	} catch (err) {
		next(err);
	}
});
export default blogRouter;
