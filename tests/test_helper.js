import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
const initialUser = [
	{
		name: "Levon",
		userName: "levonml",
		id: "123456",
	},
];
const initialBlog = [
	{
		title: "My First Test",
		author: "ME myself",
		url: "unknown",
		likes: 555,
		userId: initialUser[0].id,
	},
	{
		title: "My Second Test",
		author: "ME myself",
		url: "unknown",
		likes: 1111,
		userId: initialUser[0].id,
	},
];
let newBlog = {
	title: "My 3th Test",
	author: "ME myself",
	url: "unknown",
	likes: 3333,
	userId: initialUser[0].id,
};
const newUser = {
	name: "Levon_new",
	userName: "levon_new",
	id: "123456",
};
const notesInDb = async () => {
	console.log("beforeeeeeeeeeeeeeeeee");
	let result = await Blog.find({});
	console.log("afterrrrrrrrrrrrr");

	result = result.map((note) => note.toJSON());
	return result;
};
const usersInDb = async () => {
	let result = await User.find({});
	result = result.map((el) => el.toJSON());
	return result;
};
export default {
	initialBlog,
	newBlog,
	notesInDb,
	initialUser,
	usersInDb,
	newUser,
};
