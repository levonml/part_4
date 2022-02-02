import axios from "axios";

const newUser = async (userData) => {
	console.log("userData", userData);
	const response = await axios.post(
		"http://localhost:3003/api/users",
		userData
	);
	console.lpg("response from newUser", response);
	return response.data;
};
export default { newUser };
