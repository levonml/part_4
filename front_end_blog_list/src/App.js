import { useState } from "react";
import loginService from "./services/login.js";
import addBlogService from "./services/addBlog.js";

function App() {
	const [userName, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [newAuthor, setNewAuthor] = useState("");
	const [newTitle, setNewTitle] = useState("");

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({ userName, password });
			setUsername("");
			setPassword("");
			setUser(user);
			console.log("user token = ", user.token);
		} catch (err) {
			console.log("error", err);
		}
	};
	const addBlog = async (event) => {
		event.preventDefault();
		console.log("dkajdfakfadfdakjnakajdn");
		try {
			console.log("inside try");
			const newBlog = await addBlogService.newBlog({ newAuthor, newTitle });
			setNewAuthor("");
			setNewTitle("");
			console.log("newBlog", newBlog);
		} catch (err) {
			console.log("addBlog error", err);
		}
	};
	const loginForm = () => (
		<form onSubmit={handleLogin}>
			<div>
				login
				<input
					type="email"
					value={userName}
					name="Username"
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				password
				<input
					type="password"
					value={password}
					name="Password"
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type="submit" onClick={handleLogin}>
				login
			</button>
		</form>
	);
	const noteForm = () => (
		<form onSubmit={addBlog}>
			<div>
				Author
				<input
					type="text"
					name="author"
					value={newAuthor}
					onChange={({ target }) => setNewAuthor(target.value)}
				/>
			</div>
			<div>
				Titlte
				<input
					type="text"
					name="title"
					value={newTitle}
					onChange={({ target }) => setNewTitle(target.value)}
				/>
			</div>
			<button type="submit">save</button>
		</form>
	);
	return (
		<div>
			{!user && loginForm()}
			{user && noteForm()}
		</div>
	);
}

export default App;
