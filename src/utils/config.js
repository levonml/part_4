import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
let Mongodb_URI = null;
if (process.env.NODE_ENV === "test") {
	Mongodb_URI = process.env.Test_Mongodb_URI;
} else if (process.env.NODE_ENV === "developement") {
	Mongodb_URI = process.env.Mongodb_URI;
} else {
	Mongodb_URI = process.env.MONGODB_URI_LOCAL;
}
/* const Mongodb_URI = 
	process.env.NODE_ENV === "test"
		? process.env.Test_Mongodb_URI
		: process.env.Mongodb_URI; */
export default { Mongodb_URI, PORT };
