import logger from "./logger.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const requestLogger = (request, response, next) => {
	logger.info("Method: ", request.method);
	logger.info("Path: ", request.path);
	logger.info("Body: ", request.body);
	next();
};
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};
const errorHandler = (error, request, response, next) => {
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: `${error.message}` });
	} else if (error.name === "JsonWebTokenError") {
		return response.status(401).json({
			error: "invalid token",
		});
	} else if (error.name === "TokenExpiredError") {
		return response.status(401).json({
			error: "token expired",
		});
	}
	logger.error(error.message);
	next(error);
};

const tokenExtractor = (request, response, next) => {
	const authorization = request.get("authorization");
	console.log("header check from request", request.header);

	console.log("header check from middlewear", authorization);
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		request.token = authorization.substring(7);
	}
	next();
};
const userExtractor = async (request, response, next) => {
	try {
		//console.log("Extracted Tokeeen", request.token);
		const decodedToken = request.token
			? jwt.verify(request.token, process.env.SECRET)
			: null;
		//console.log("decodedToken - ", decodedToken);
		if (!decodedToken || !decodedToken.id) {
			return response.status(401).json({ error: "token missing or invalid" });
		}
		//console.log("decodedToken.id ======", decodedToken.id);
		//console.log(":users in the databasw =", await User.find({}));
		const user = await User.findById(decodedToken.id);
		//console.log("useeeeeeeeeeeeeer  after", user);
		if (!user) {
			return response.status(401).json({ error: "invalid tiken" });
		}
		request.user = user;
	} catch (err) {
		next(err);
	}
	next();
};
export default {
	errorHandler,
	unknownEndpoint,
	requestLogger,
	tokenExtractor,
	userExtractor,
};
