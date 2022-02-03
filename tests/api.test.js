import supertest from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import Blog from "../src/models/blogModel.js";
import User from "../src/models/userModel";
import helper from "./test_helper";
//import { jest } from "@jest/globals";

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	for (let i = 0; i < helper.initialBlog.length; i++) {
		await new Blog(helper.initialBlog[i]).save();
	}
	await User.deleteMany({});
	for (let i = 0; i < helper.initialUser.length; i++) {
		console.log(
			"initialllll usereer",
			await new User(helper.initialUser[i]).save()
		);
	}
});
describe("testing api", () => {
	test("Blogs api returns json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});
	test("Users api returns json", async () => {
		await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});
});
describe("check the number of lists", () => {
	test("database has currect number of lists and 'id' key is defined", async () => {
		const receivedBlog = await api.get("/api/blogs");
		expect(receivedBlog.body).toHaveLength(helper.initialBlog.length);
		expect(receivedBlog.body[0].id).toBeDefined();
	});
});
describe("adding a note to the blog with the POST method", () => {
	test("success with status code 201, length has increesed by one ", async () => {
		const received = await api
			.post("/api/login")
			.send(helper.userForLogin)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		await api
			.post("/api/blogs")
			.send(helper.newBlog)
			.set("Authorization", `Bearer ${received.body.token}`)
			.expect(201)
			.expect("Content-Type", /application\/json/);
		const receivedNotes = await helper.notesInDb();
		console.log("receivedNotes from creator ===", receivedNotes);
		expect(receivedNotes.length).toBe(helper.initialBlog.length + 1);
	});
});
describe("modifying a note to the blog with the Put request", () => {
	test("success with status code 201, likes has modified ", async () => {
		const BlogAtStart = await helper.notesInDb();
		let NoteToModify = BlogAtStart[0];
		NoteToModify.likes = 5000;
		await api
			.put(`/api/blogs/${NoteToModify.id}`)
			.send(NoteToModify)
			.expect(201)
			.expect("Content-Type", /application\/json/);
		const receivedNotes = await helper.notesInDb();
		expect(receivedNotes[0].likes).toBe(5000);
	});
});
describe("deleting a single note", () => {
	test("success with status code 200 if id is valid", async () => {
		await Blog.deleteMany({});
		const received = await api.post("/api/login").send(helper.userForLogin);
		await api
			.post("/api/blogs")
			.send(helper.newBlog)
			.set("Authorization", `Bearer ${received.body.token}`);
		let blogAtStart = await helper.notesInDb();
		await api
			.delete(`/api/blogs/${blogAtStart[0].id}`)
			.set("Authorization", `Bearer ${received.body.token}`)
			.expect(204);
		const receivedBlog = await helper.notesInDb();
		expect(receivedBlog).toHaveLength(blogAtStart.length - 1);
	});
});
describe("get a single note with id", () => {
	test("success with a valid id", async () => {
		let blogAtStart = await helper.notesInDb();
		const requestedList = await api
			.get(`/api/blogs/${blogAtStart[0].id}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		expect(requestedList.body).toEqual(blogAtStart[0]);
	});
});
describe("get all existing users", () => {
	test("check the number of existing users", async () => {
		const receivedUsers = await api.get("/api/users");
		const usersAtStart = await helper.usersInDb();
		expect(receivedUsers.body).toHaveLength(usersAtStart.length);
	});
});
describe("add a new user", () => {
	test("return error in case of not unique value of userName", async () => {
		//await api.post("/api/users").send(helper.initialUser);
		await api.post("/api/users").send(helper.newUser);
		const receivedUsers = await api.get("/api/users");
		expect(receivedUsers.body).toHaveLength(2);
	});
});
afterAll(() => {
	mongoose.connection.close();
});
