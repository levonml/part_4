import express from "express";
import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import middlewear from "../utils/middlewears.js";

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
			const user = request.user;
			let blog = new Blog({
				author: request.body.author,
				title: request.body.title,
				user: user._id,
			});
			const saved_blog = await blog.save();
			const newNote = user.notes.concat(saved_blog._id);
			await user.update({ notes: newNote });
			response.status(201).json(saved_blog).end();
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
