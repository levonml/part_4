import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import blogRouter from "./controllers/blogRouter.js";
import userRouter from "./controllers/userRouter.js";
import loginRouter from "./controllers/loginRouter.js";

import config from "./utils/config.js";
import logger from "./utils/logger.js";
import middlewear from "./utils/middlewears.js";

const app = express();

mongoose
	.connect(config.Mongodb_URI)
	.then(() => logger.info("connected to database"))
	.catch((error) =>
		logger.error("error connecting to database: ", error.message)
	);

app.use(cors());
app.use(express.json());
app.use(middlewear.requestLogger);
app.use(middlewear.tokenExtractor);
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use(middlewear.errorHandler);
app.use(middlewear.unknownEndpoint);
export default app;
//module.exports = app;
