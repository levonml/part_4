import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
	title: { type: String, required: true },
	author: String,
	url: { type: String },
	likes: {
		type: Number,
		default: 0,
	},
	userId: String,
	id: String,
	user: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
});
blogSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

export default mongoose.model("Blog", blogSchema);
