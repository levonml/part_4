import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
	name: String,
	userName: {
		type: String,
		unique: true,
		minLength: 3,
		required: true,
	},
	password: { type: String, minLength: 3, required: true },
	notes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
		},
	],
});
userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.password;
	},
});
userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);
