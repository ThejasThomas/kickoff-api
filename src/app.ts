import 'reflect-metadata'
import "./presentation/di/resolver"
import { ExpressServer } from "./presentation/http/server";
import { createServer } from "http";
import { config } from './shared/config';
import chalk from "chalk";
import { MongoConnect } from "./interfaceAdapters/database/mongoDb/mongoConnect";

async function startApp() {
  const expressServer = new ExpressServer();
  const mongoConnect = new MongoConnect();

  try {
    await mongoConnect.connectDB(); 
    const httpServer = createServer(expressServer.getApp());

  

    httpServer.listen(config.server.PORT, () => {
      console.log(
        chalk.yellowBright.bold(
          `Server running at ${chalk.blueBright(`http://localhost:${config.server.PORT}`)}`
        )
      );
      console.log(chalk.greenBright("--------------------------------------------------\n"));
    });

  } catch (err) {
    console.error(chalk.redBright.bold("❌ Failed to start server"), err);
  }
}

startApp();
