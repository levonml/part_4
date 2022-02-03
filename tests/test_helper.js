import Blog from "../src/models/blogModel.js";
import User from "../src/models/userModel.js";
import bcrypt from "bcrypt";

const password = "12345";
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);
const initialUser = [
	{
		name: "Levon",
		userName: "levonml",
		password: passwordHash,
	},
];
const initialBlog = [
	{
		title: "My First Test",
		author: "ME myself",
		url: "unknown",
		likes: 555,
		//user: [initialUser[0].id],
	},
	{
		title: "My Second Test",
		author: "ME myself",
		url: "unknown",
		likes: 1111,
		//user: [initialUser[0].id],
	},
];
let newBlog = {
	title: "My 3th Test",
	author: "ME myself",
	url: "unknown",
	likes: 3333,
	//user: [initialUser[0].id],
};
const newUser = {
	name: "Levon_new",
	userName: "levon_new",
	password: "12345",
};
const userForLogin = {
	userName: initialUser[0].userName,
	password: password,
};
const notesInDb = async () => {
	let result = await Blog.find({});
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
	userForLogin,
	password,
};
