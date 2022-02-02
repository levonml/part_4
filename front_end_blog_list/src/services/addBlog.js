import axios from "axios";

const baseUrl = "http://localhost:3003/api/blogs";

const newBlog = async (blogData) => {
	const newBlog = {
		author: blogData.newAuthor,
		title: blogData.newTitle,
	};
	console.log("blog before axios", newBlog);
	const res = await axios.post(baseUrl, newBlog);
	console.log("blog after axios", newBlog);
	console.log("res from addBlog", res);
	return res.data;
};
export default { newBlog };
