const express = require("express");

const { serverconfig, logger } = require("./config");

const app = express();

const apiRouter = require("./routes");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api',apiRouter);

app.listen(serverconfig.PORT, () => {
  console.log(`Server is running successfully at port : ${serverconfig.PORT}`);
  logger.info("Successfully started the server",{});
});
