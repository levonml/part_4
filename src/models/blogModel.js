import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number,
	userId: String,
	id: String,
	//_id: mongoose.Schema.Types.ObjectId,
	//__v: mongoose.Schema.Types.ObjectId,
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
