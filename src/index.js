import app from "./app.js";
//const app = require("./app.js");
import config from "./utils/config.js";
import logger from "./utils/logger.js";

app.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`);
});
